# Book-Library
# 📚 Book Notes - Personal Reading Library Tracker

A beautiful, modern web application for tracking your reading journey, managing book collections, and discovering new stories. Built with Node.js, Express, PostgreSQL, and a stunning responsive frontend.

![Book Notes App](https://img.shields.io/badge/Node.js-14.0+-green) ![Express](https://img.shields.io/badge/Express-4.18+-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-purple) ![EJS](https://img.shields.io/badge/EJS-3.0+-orange)

## ✨ Features

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
- **PostgreSQL Database**: Data persistence

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14.0 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn** package manager

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
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    isbn VARCHAR(50),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    date_read DATE,
    cover_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. **Environment Configuration**
Create a `.env` file in the root directory (optional):

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=Books
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3000
```

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
│   └── edit.ejs            # Edit book form
├── index.js                # Main server file
├── package.json            # Project dependencies
└── README.md               # This file
```

## 🎯 Key Features Explained

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

### **Responsive Design**
Mobile-first approach with:
- **Flexible Grid**: Automatically adjusts columns based on screen size
- **Touch Optimization**: Proper button sizes for mobile devices
- **Adaptive Layout**: Header and content adapt to different screen sizes

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Display all books (main page) |
| `GET` | `/add` | Show add book form |
| `POST` | `/add` | Create new book |
| `GET` | `/edit/:id` | Show edit book form |
| `POST` | `/edit/:id` | Update existing book |
| `POST` | `/delete/:id` | Delete book |


## 🙏 Acknowledgments

- **Open Library**: For providing book cover API
- **Font Awesome**: For the beautiful icons
- **Google Fonts**: For the Inter font family
- **Express.js Team**: For the excellent web framework


## 🔮 Future Enhancements

- [ ] **Search & Filter**: Advanced book search and filtering
- [ ] **Categories**: Organize books by genre, author, or reading status
- [ ] **Reading Progress**: Track current reading progress
- [ ] **Export/Import**: Backup and restore functionality
- [ ] **Social Features**: Share reading lists and reviews
- [ ] **Mobile App**: React Native or PWA version
- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **Analytics**: Reading statistics and insights
