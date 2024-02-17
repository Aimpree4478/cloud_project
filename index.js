const express = require('express');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});


app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/addUser', (req, res) => {
    const { username, email, link } = req.body; // Assuming your request body contains username, email, and link fields

    const sql = "INSERT INTO users (username, email, link) VALUES (?, ?, ?)";
    db.query(sql, [username, email, link], (err, result) => {
        if (err) return res.json(err);
        return res.json({ message: 'User added successfully', id: result.insertId });
    });
});

const port = 500;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
