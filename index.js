import express from "express";
import bodyParser from "body-parser";
import pg from "pg"
import axios from "axios";
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import flash from "connect-flash";

dotenv.config();

const app = express();
const port = 3000;
const saltRounds = 10;

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Make user data available to all templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = new pg.Client({
    user: process.env.PG_USER || "postgres",
    host: process.env.PG_HOST || "localhost",
    database: process.env.PG_DATABASE || "Books",
    password: process.env.PG_PASSWORD || "kukanaka@1213",
    port: process.env.PG_PORT || 5432
});

db.connect();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Utility function to fetch cover URL from Open Library
async function getCoverUrl({ isbn, title }) {
  let coverUrl = "/default-cover.svg"; // fallback
  try {
    let apiUrl = isbn && isbn.trim() !== ""
      ? `https://openlibrary.org/search.json?isbn=${isbn}`
      : `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`;

    const { data } = await axios.get(apiUrl);
    if (data.docs && data.docs.length > 0 && data.docs[0].cover_i) {
      coverUrl = `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`;
    }
  } catch (err) {
    console.error("Error fetching cover:", err.message);
  }
  return coverUrl;
}

// Generate Amazon URL for a book using ISBN (prefer product page) with safe fallbacks
function toIsbn10(isbn) {
  if (!isbn) return null;
  const clean = String(isbn).replace(/[^0-9Xx]/g, "");
  if (clean.length === 10) return clean.toUpperCase();
  if ((clean.startsWith("978") || clean.startsWith("979")) && clean.length === 13) {
    const core = clean.slice(3, 12); // 9 digits
    if (!/^\d{9}$/.test(core)) return null;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(core[i], 10) * (10 - (i + 1));
    }
    // Correct weighting: positions 1..9 weighted 10..2
    sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(core[i], 10) * (10 - i);
    }
    const remainder = sum % 11;
    let check = 11 - remainder;
    let checkChar;
    if (check === 10) checkChar = "X";
    else if (check === 11) checkChar = "0";
    else checkChar = String(check);
    return core + checkChar;
  }
  return null;
}

function getAmazonUrl(isbn, title) {
  const base = "https://www.amazon.com";
  if (isbn) {
    const isbn10 = toIsbn10(isbn);
    if (isbn10) return `${base}/dp/${isbn10}`;
    return `${base}/s?k=${encodeURIComponent(String(isbn))}`;
  }
  if (title) {
    return `${base}/s?k=${encodeURIComponent(String(title))}`;
  }
  return base;
}

// Show users who have added books
app.get("/", async (req, res) => {
  try {
    console.log("Fetching users with books...");
    
    // Get users who have added books, with book count
    const usersWithBooks = await db.query(`
      SELECT 
        u.id, 
        u.username, 
        u.first_name, 
        u.last_name, 
        COUNT(b.id) as book_count, 
        COALESCE(ROUND(AVG(b.rating), 1), 0) as avg_rating
      FROM users u 
      INNER JOIN books b ON u.id = b.user_id 
      GROUP BY u.id, u.username, u.first_name, u.last_name
      ORDER BY book_count DESC, avg_rating DESC
    `);

    console.log(`Found ${usersWithBooks.rows.length} users with books`);
    console.log("Users data:", usersWithBooks.rows);

    // Ensure all numeric values are properly formatted
    const formattedUsers = usersWithBooks.rows.map(user => ({
      ...user,
      book_count: parseInt(user.book_count) || 0,
      avg_rating: parseFloat(user.avg_rating) || 0
    }));

    console.log("Formatted users:", formattedUsers);

    res.render("index.ejs", { users: formattedUsers });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching users");
  }
});

// Dashboard for authenticated users to manage their books
app.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    let books = (await db.query("SELECT * FROM books WHERE user_id = $1 ORDER BY rating DESC, title ASC", [req.user.id])).rows;

    // If any book has missing/default cover, fetch fresh
    books = await Promise.all(
      books.map(async (book) => {
        if (!book.cover_url || book.cover_url.includes("default-cover.svg")) {
          book.cover_url = await getCoverUrl({
            isbn: book.isbn,
            title: book.title
          });
        }
        book.amazon_url = getAmazonUrl(book.isbn, book.title);
        return book;
      })
    );

    res.render("dashboard.ejs", { books, user: req.user });
  } catch (err) {
    console.error("Error in dashboard route:", err);
    res.status(500).send("Error fetching books");
  }
});

// Public view of any user's books (accessible to everyone)
app.get("/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    console.log(`Fetching books for user: ${username}`);
    
    // Get user information
    const userResult = await db.query("SELECT id, username, first_name, last_name FROM users WHERE username = $1", [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    
    const user = userResult.rows[0];
    console.log(`Found user: ${user.first_name} ${user.last_name} (ID: ${user.id})`);
    
    // Get user's books
    let books = (await db.query("SELECT * FROM books WHERE user_id = $1 ORDER BY rating DESC, title ASC", [user.id])).rows;
    console.log(`Found ${books.length} books for user ${user.username}`);

    // If any book has missing/default cover, fetch fresh
    books = await Promise.all(
      books.map(async (book) => {
        if (!book.cover_url || book.cover_url.includes("default-cover.svg")) {
          book.cover_url = await getCoverUrl({
            isbn: book.isbn,
            title: book.title
          });
        }
        book.amazon_url = getAmazonUrl(book.isbn, book.title);
        return book;
      })
    );

    res.render("user-books.ejs", { books, user, currentUser: req.user });
  } catch (err) {
    console.error("Error fetching user books:", err);
    res.status(500).send("Error fetching user books");
  }
});

app.get("/add", isAuthenticated, (req, res) => {
    res.render("add.ejs", { user: req.user });
});

app.get("/login", (req, res) => {
    res.render("login.ejs", { error: req.flash('error'), success: req.flash('success') });
});

app.get("/register", (req, res) => {
    res.render("register.ejs", { error: req.flash('error') });
});

app.get("/edit/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query("SELECT * FROM books WHERE id = $1 AND user_id = $2", [id, req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).send("Book not found or access denied");
        }
        res.render("edit.ejs", { book: result.rows[0], user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching book for edit");
    }
});

app.post("/add", isAuthenticated, async (req, res) => {
  const { title, author, isbn, rating, notes, read_date } = req.body;
  try {
    const cover_url = await getCoverUrl({ isbn, title });

    await db.query(
      "INSERT INTO books (title, author, isbn, rating, notes, date_read, cover_url, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [title, author, isbn, rating, notes, read_date, cover_url, req.user.id]
    );

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding book");
  }
});

// Edit a book
app.post("/edit/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, rating, notes, read_date } = req.body;
  try {
    // Check if user owns this book
    const bookCheck = await db.query("SELECT id FROM books WHERE id = $1 AND user_id = $2", [id, req.user.id]);
    if (bookCheck.rows.length === 0) {
      return res.status(403).send("Access denied");
    }

    const cover_url = await getCoverUrl({ isbn, title });

    await db.query(
      "UPDATE books SET title=$1, author=$2, isbn=$3, rating=$4, notes=$5, date_read=$6, cover_url=$7 WHERE id=$8 AND user_id=$9",
      [title, author, isbn, rating, notes, read_date, cover_url, id, req.user.id]
    );

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating book");
  }
});

// Delete a book
app.post("/delete/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    // Check if user owns this book
    const bookCheck = await db.query("SELECT id FROM books WHERE id = $1 AND user_id = $2", [id, req.user.id]);
    if (bookCheck.rows.length === 0) {
      return res.status(403).send("Access denied");
    }

    await db.query("DELETE FROM books WHERE id = $1 AND user_id = $2", [id, req.user.id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting book");
  }
});

// User registration
app.post("/register", async (req, res) => {
  const { username, email, password, first_name, last_name } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await db.query("SELECT * FROM users WHERE email = $1 OR username = $2", [email, username]);
    if (existingUser.rows.length > 0) {
      req.flash('error', 'User already exists with this email or username');
      return res.redirect("/register");
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    await db.query(
      "INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4, $5)",
      [username, email, hashedPassword, first_name, last_name]
    );
    
    req.flash('success', 'Registration successful! Please login.');
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error creating user');
    res.redirect("/register");
  }
});

// User login
app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

// Google OAuth routes
app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

app.get("/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: "/login", failureFlash: true }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// Logout route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/");
  });
});

// Passport Local Strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (result.rows.length === 0) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      
      const user = result.rows[0];
      const isValid = await bcrypt.compare(password, user.password_hash);
      
      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } catch (err) {
      return done(err);
    }
  }
));

// Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
  try {
    console.log("Google profile:", profile);
    
    // Check if user already exists
    let result = await db.query("SELECT * FROM users WHERE google_id = $1 OR email = $2", [profile.id, profile.emails[0].value]);
    
    if (result.rows.length > 0) {
      // Update existing user with Google ID if they don't have one
      if (!result.rows[0].google_id) {
        await db.query("UPDATE users SET google_id = $1 WHERE id = $2", [profile.id, result.rows[0].id]);
      }
      return done(null, result.rows[0]);
    }
    
    // Create new user with Google profile data
    const newUser = await db.query(
      "INSERT INTO users (google_id, email, username, first_name, last_name, profile_picture) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        profile.id,
        profile.emails[0].value,
        (profile.displayName || profile.emails[0].value.split('@')[0]).replace(/\s+/g, '_').toLowerCase() + '_' + Date.now(),
        profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User',
        profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || '',
        profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null
      ]
    );
    
    return done(null, newUser.rows[0]);
  } catch (err) {
    console.error("Google OAuth error:", err);
    return done(err);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});