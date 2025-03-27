// Import necessary modules
const express = require('express');
const authController = require('./controller/authController');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();

console.log('✅ app.js loaded — setting up middleware and routes...');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'view')));

// Log requests
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// Auth + API routes (no session)
app.post('/register', authController.register);
app.post('/login', authController.login);

// Profile data
app.post('/save-profile', authController.saveUserProfile);
app.post('/add-link', authController.addUserLink);
app.post('/save-full-profile', authController.saveFullProfile);
app.get('/get-user-profile/:accountId', authController.getUserProfileAndLinks);

// Serve HTML routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

app.get('/vid', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'vid.html'));
});

app.get('/post-job', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'post-job.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'search.html'));
});

// Database config
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '270202',
    database: 'ProfileMe'
};

// Job search
app.get('/get-jobs', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [jobs] = await connection.execute('SELECT * FROM jobs ORDER BY DatePosted DESC');
        await connection.end();
        res.json(jobs);
    } catch (error) {
        console.error('❗ Error fetching jobs:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// 404 fallback
app.use((req, res) => {
    console.log(`❓ Unhandled route: ${req.method} ${req.url}`);
    res.status(404).send('404 - Not Found');
});

// DB connection + server start
async function connectToDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to the database');

        const port = 3000;
        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('❗ DB connection error:', error);
    }
}

connectToDB();