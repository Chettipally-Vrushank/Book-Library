<<<<<<< HEAD
# 📚 Book Notes - Personal Reading Library Tracker

A beautiful, modern web application for tracking your reading journey, managing book collections, and discovering new stories. Built with Node.js, Express, PostgreSQL, and a stunning responsive frontend with **user authentication and multi-user support**.

![Book Notes App](https://img.shields.io/badge/Node.js-14.0+-green) ![Express](https://img.shields.io/badge/Express-4.18+-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-purple) ![EJS](https://img.shields.io/badge/EJS-3.0+-orange) ![Authentication](https://img.shields.io/badge/Auth-Google_OAuth-red)

## ✨ Features

### 🔐 **User Authentication & Management**
- **User Registration**: Create accounts with email, username, and password
- **User Login**: Secure authentication system
- **Google OAuth**: Sign in/up with Google accounts
- **Multi-User Support**: Each user has their own book collection
- **User Profiles**: Personalized reading experience

=======
# Book-Library
# 📚 Book Notes - Personal Reading Library Tracker

A beautiful, modern web application for tracking your reading journey, managing book collections, and discovering new stories. Built with Node.js, Express, PostgreSQL, and a stunning responsive frontend.

![Book Notes App](https://img.shields.io/badge/Node.js-14.0+-green) ![Express](https://img.shields.io/badge/Express-4.18+-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-purple) ![EJS](https://img.shields.io/badge/EJS-3.0+-orange)

## ✨ Features

>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b
### 🎨 **Beautiful Modern UI/UX**
- **Glassmorphism Design**: Semi-transparent cards with backdrop blur effects
- **Responsive Layout**: Optimized for all devices (desktop, tablet, mobile)
- **Gradient Backgrounds**: Beautiful purple-blue gradient theme
- **Smooth Animations**: Hover effects, transitions, and loading animations
- **Modern Typography**: Inter font family for excellent readability

### 📖 **Book Management**
- **Add New Books**: Complete book information with title, author, ISBN, rating, and notes
- **Edit Books**: Update any book details easily
- **Delete Books**: Remove books with confirmation dialog
- **Book Covers**: Automatic cover fetching from Open Library API
- **Rating System**: Interactive 5-star rating with visual feedback
<<<<<<< HEAD
- **User Attribution**: See which user rated each book
=======
>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b

### 🔍 **Smart Cover Integration**
- **Open Library API**: Automatically fetches book covers using ISBN or title
- **Fallback Handling**: Professional SVG placeholder for missing covers
- **Real-time Preview**: See cover previews while adding/editing books
- **Error Recovery**: Graceful handling of API failures

### 📊 **Statistics Dashboard**
- **Total Books Count**: Track your growing library
- **Average Rating**: See your overall reading satisfaction
- **Favorites Count**: Books rated 4+ stars
- **Visual Stats**: Beautiful stat cards with hover effects
<<<<<<< HEAD
- **Multi-User Stats**: View ratings from all users
=======
>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Proper button sizes and spacing
- **Flexible Grid**: Automatically adjusts layout based on screen width
- **Cross-Platform**: Works seamlessly on all devices

## 🚀 Technology Stack

### **Backend**
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **PostgreSQL**: Relational database
- **pg (node-postgres)**: PostgreSQL client for Node.js
- **Axios**: HTTP client for API requests

### **Frontend**
- **EJS**: Embedded JavaScript templating
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Modern JavaScript features
- **Font Awesome**: Icon library
- **Google Fonts**: Inter font family

### **APIs & Services**
- **Open Library API**: Book cover and metadata
<<<<<<< HEAD
- **Google OAuth**: User authentication
- **PostgreSQL Database**: Data persistence with user management
=======
- **PostgreSQL Database**: Data persistence
>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14.0 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn** package manager
<<<<<<< HEAD
- **Google OAuth Credentials** (for Google sign-in)
=======
>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b

## 🛠️ Installation & Setup

### 1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/book-notes.git
cd book-notes
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Database Setup**
<<<<<<< HEAD
Create a PostgreSQL database named `Books` and run the setup script:

```bash
# Connect to your PostgreSQL database
psql -U postgres -d Books

# Run the database setup script
\i database_setup.sql
```

Or manually create the tables:

```sql
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    google_id VARCHAR(255),
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create books table with user support
=======
Create a PostgreSQL database named `Books` and update the connection details in `index.js`:

```javascript
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Books",
    password: "your_password",
    port: 5432
});
```

### 4. **Create Database Table**
Run this SQL query in your PostgreSQL database:

```sql
>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    isbn VARCHAR(50),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    date_read DATE,
    cover_url TEXT,
<<<<<<< HEAD
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_books_user_id ON books(user_id);
CREATE INDEX idx_books_rating ON books(rating DESC);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### 4. **Environment Configuration**
Create a `.env` file in the root directory:
=======
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. **Environment Configuration**
Create a `.env` file in the root directory (optional):
>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=Books
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3000
<<<<<<< HEAD

# Google OAuth (for backend implementation)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# JWT Secret (for backend implementation)
JWT_SECRET=your_jwt_secret_key
```

### 5. **Google OAuth Setup**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set authorized redirect URIs to `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file

=======
```

>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b
### 6. **Start the Application**
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start

# Or directly with Node.js
node index.js
```

### 7. **Access the Application**
Open your browser and navigate to: `http://localhost:3000`

## 📁 Project Structure

```
book-notes/
├── public/
│   ├── styles.css          # Main stylesheet
│   └── default-cover.svg   # Default book cover placeholder
├── views/
│   ├── index.ejs           # Main library page
│   ├── add.ejs             # Add new book form
<<<<<<< HEAD
│   ├── edit.ejs            # Edit book form
│   ├── login.ejs           # User login page
│   └── register.ejs        # User registration page
├── index.js                # Main server file
├── database_setup.sql      # Database setup script
=======
│   └── edit.ejs            # Edit book form
├── index.js                # Main server file
>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b
├── package.json            # Project dependencies
└── README.md               # This file
```

<<<<<<< HEAD
## 🔐 Authentication Features

### **User Registration**
- **Personal Information**: First name, last name, username
- **Account Details**: Email and password
- **Password Validation**: Confirmation and strength requirements
- **Terms Agreement**: Links to terms and privacy policy

### **User Login**
- **Email/Password**: Traditional authentication
- **Google OAuth**: One-click sign-in with Google
- **Session Management**: Secure user sessions
- **Password Recovery**: Forgot password functionality (backend implementation needed)

### **Google OAuth Integration**
- **Seamless Sign-In**: Users can sign in with their Google account
- **Profile Information**: Automatically imports name and profile picture
- **Secure Authentication**: Industry-standard OAuth 2.0 flow
- **No Password Required**: Eliminates password management for users

## 🎯 Key Features Explained

### **Multi-User Book Management**
Each user can:
- **Add Books**: Create their own reading list
- **Rate Books**: Give personal ratings (1-5 stars)
- **Add Notes**: Personal thoughts and reviews
- **View All Ratings**: See how other users rated books
- **Personal Library**: Manage their own collection

=======
## 🎯 Key Features Explained

>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b
### **Book Cover Management**
The application automatically fetches book covers from Open Library API:
- **ISBN Priority**: First tries to fetch cover using ISBN
- **Title Fallback**: If ISBN fails, searches by book title
- **Smart Caching**: Stores cover URLs in database for performance
- **Error Handling**: Graceful fallback to custom SVG placeholder

### **Rating System**
Interactive 5-star rating with visual feedback:
- **Visual Stars**: Hover effects and color changes
- **Validation**: Ensures ratings are between 1-5
- **Statistics**: Calculates average ratings and favorites
<<<<<<< HEAD
- **User Attribution**: Shows which user gave each rating
=======
>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b

### **Responsive Design**
Mobile-first approach with:
- **Flexible Grid**: Automatically adjusts columns based on screen size
- **Touch Optimization**: Proper button sizes for mobile devices
- **Adaptive Layout**: Header and content adapt to different screen sizes

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
<<<<<<< HEAD
| `GET` | `/` | Display all books with user information |
| `GET` | `/login` | Show login form |
| `GET` | `/register` | Show registration form |
| `POST` | `/login` | Handle user login |
| `POST` | `/register` | Handle user registration |
=======
| `GET` | `/` | Display all books (main page) |
>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b
| `GET` | `/add` | Show add book form |
| `POST` | `/add` | Create new book |
| `GET` | `/edit/:id` | Show edit book form |
| `POST` | `/edit/:id` | Update existing book |
| `POST` | `/delete/:id` | Delete book |

<<<<<<< HEAD
## 🎨 Customization

### **Changing Colors**
Update the CSS variables in `public/styles.css`:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f6ad55;
  --text-color: #2d3748;
  --background-color: #f7fafc;
}
```

### **Adding New User Fields**
To add new user fields:
1. Update the `users` table in database
2. Modify the forms in `views/register.ejs`
3. Update the backend routes in `index.js`
4. Update the display in `views/index.ejs`

## 🚀 Deployment

### **Heroku Deployment**
1. Create a Heroku account
2. Install Heroku CLI
3. Create a new Heroku app
4. Add PostgreSQL addon
5. Set environment variables for Google OAuth
6. Deploy using Git:

```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set GOOGLE_CLIENT_ID=your_client_id
heroku config:set GOOGLE_CLIENT_SECRET=your_client_secret
git push heroku main
```

### **Vercel Deployment**
1. Connect your GitHub repository to Vercel
2. Configure environment variables for Google OAuth
3. Deploy automatically on push

### **DigitalOcean App Platform**
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy with automatic scaling

## 🔒 Security Features

### **Authentication Security**
- **Password Hashing**: Secure password storage (backend implementation needed)
- **JWT Tokens**: Secure session management (backend implementation needed)
- **OAuth 2.0**: Industry-standard Google authentication
- **Input Validation**: Form validation and sanitization

### **Data Protection**
- **User Isolation**: Users can only access their own data
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization and output encoding
- **CSRF Protection**: Cross-site request forgery prevention (backend implementation needed)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### **Development Guidelines**
- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed
- Implement backend authentication logic

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
=======
>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b

## 🙏 Acknowledgments

- **Open Library**: For providing book cover API
<<<<<<< HEAD
- **Google**: For OAuth 2.0 authentication
=======
>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b
- **Font Awesome**: For the beautiful icons
- **Google Fonts**: For the Inter font family
- **Express.js Team**: For the excellent web framework

<<<<<<< HEAD
## 📞 Support

If you encounter any issues or have questions:

1. **Check Issues**: Look for existing solutions in GitHub Issues
2. **Create Issue**: Report bugs or request features
3. **Documentation**: Review this README and code comments
4. **Community**: Join discussions in the project repository

## 🔮 Future Enhancements

- [ ] **Backend Authentication**: Implement JWT and session management
- [ ] **Password Recovery**: Forgot password functionality
- [ ] **User Profiles**: Enhanced user profile pages
- [ ] **Social Features**: Follow other users and share reading lists
=======

## 🔮 Future Enhancements

>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b
- [ ] **Search & Filter**: Advanced book search and filtering
- [ ] **Categories**: Organize books by genre, author, or reading status
- [ ] **Reading Progress**: Track current reading progress
- [ ] **Export/Import**: Backup and restore functionality
<<<<<<< HEAD
- [ ] **Mobile App**: React Native or PWA version
- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **Analytics**: Reading statistics and insights
- [ ] **Book Recommendations**: AI-powered book suggestions

## ⚠️ Important Notes

### **Backend Implementation Required**
This frontend includes all the UI components for authentication, but the backend logic needs to be implemented:

1. **User Registration/Login**: Password hashing, JWT tokens, session management
2. **Google OAuth**: OAuth 2.0 flow implementation
3. **Database Integration**: User data storage and retrieval
4. **Security Middleware**: Authentication guards, input validation

### **Database Schema Updates**
The current database needs to be updated to support users:
- Add `user_id` column to `books` table
- Create `users` table with authentication fields
- Update existing queries to include user information

---

**Happy Reading! 📚✨**

Built with ❤️ using Node.js, Express, PostgreSQL, and Google OAuth.
=======
- [ ] **Social Features**: Share reading lists and reviews
- [ ] **Mobile App**: React Native or PWA version
- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **Analytics**: Reading statistics and insights
>>>>>>> 62a4335c27c05b68a2b7bff6fbe78bd977a77e0b
