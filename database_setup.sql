-- Database setup for Book Notes application with user authentication
-- Run this script in your PostgreSQL database

-- Create users table
CREATE TABLE IF NOT EXISTS users (
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

-- Update books table to include user_id
ALTER TABLE books ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

-- If you need to recreate the books table completely, use this:
-- DROP TABLE IF EXISTS books;
-- CREATE TABLE books (
--     id SERIAL PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     author VARCHAR(255),
--     isbn VARCHAR(50),
--     rating INTEGER CHECK (rating >= 1 AND rating <= 5),
--     notes TEXT,
--     date_read DATE,
--     cover_url TEXT,
--     user_id INTEGER REFERENCES users(id),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_rating ON books(rating DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insert sample user (for testing purposes)
-- INSERT INTO users (username, email, first_name, last_name) 
-- VALUES ('demo_user', 'demo@example.com', 'Demo', 'User');

-- Insert sample books with user_id (uncomment and modify as needed)
-- INSERT INTO books (title, author, isbn, rating, notes, date_read, user_id) 
-- VALUES ('Sample Book', 'Sample Author', '1234567890', 5, 'Great book!', '2024-01-15', 1);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON TABLE users TO your_username;
-- GRANT ALL PRIVILEGES ON TABLE books TO your_username;
-- GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO your_username;
-- GRANT USAGE, SELECT ON SEQUENCE books_id_seq TO your_username;
