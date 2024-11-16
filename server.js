const express = require('express');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection setup using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'ahmadds',
    password: process.env.DB_PASS || 'a1h2m3a4d5',
    database: process.env.DB_NAME || 'Online_exam',
    port: process.env.DB_PORT || 3306
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// POST route to save user data to the database
app.post('/Online_exam/save_user', (req, res) => {
    const { name, address, phone_no, email, quali, gender, dob, password } = req.body;
    const query = 'INSERT INTO rct1 (name, address, phone_no, email, quali, gender, dob, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    db.execute(query, [name, address, phone_no, email, quali, gender, dob, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'User saved successfully' });
    });
});

// GET route to fetch all data from the rct1 table
app.get('/data', (req, res) => {
    const query = 'SELECT * FROM rct1';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
