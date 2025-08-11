import express from "express";
import bodyParser from "body-parser";
import pg from "pg"
import axios from "axios";

const app=express();
const port=3000
app.use(express.static('public'));

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"Books",
    password:"kukanaka@1213",
    port:5432
})
db.connect();

app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}));
// Utility to fetch cover URL from Open Library
// Utility function to fetch cover
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

// Show all books with covers
app.get("/", async (req, res) => {
  try {
    let books = (await db.query("SELECT * FROM books ORDER BY rating ASC")).rows;

    // If any book has missing/default cover, fetch fresh
    books = await Promise.all(
      books.map(async (book) => {
        if (!book.cover_url || book.cover_url.includes("default-cover.png")) {
          book.cover_url = await getCoverUrl({
            isbn: book.isbn,
            title: book.title
          });
        }
        return book;
      })
    );

    res.render("index.ejs", { books });
  } catch (err) {
    console.error(err);
    res.status(400).send("Error fetching book");
  }
});


app.get("/add",(req,res)=>{
    res.render("add.ejs")
})
app.get("/edit/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).send("Book not found");
        }
        res.render("edit.ejs", { book: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching book for edit");
    }
});

app.post("/add", async (req, res) => {
  const { title, author, isbn, rating, notes, read_date } = req.body;
  try {
    const cover_url = await getCoverUrl({ isbn, title });

    await db.query(
      "INSERT INTO books (title, author, isbn, rating, notes, date_read, cover_url) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [title, author, isbn, rating, notes, read_date, cover_url]
    );

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding book");
  }
});

// Edit a book
app.post("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, rating, notes, read_date } = req.body;
  try {
    const cover_url = await getCoverUrl({ isbn, title });

    await db.query(
      "UPDATE books SET title=$1, author=$2, isbn=$3, rating=$4, notes=$5, date_read=$6, cover_url=$7 WHERE id=$8",
      [title, author, isbn, rating, notes, read_date, cover_url, id]
    );

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating book");
  }
});

// Delete a book
app.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting book");
  }
});


app.listen(port,(req,res)=>{
    console.log(`Server running on port ${port}`)
})