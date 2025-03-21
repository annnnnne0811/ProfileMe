// Import necessary modules
const express = require('express');
const authController = require('./controller/authController'); 
const path = require('path'); 
const mysql = require('mysql2/promise');

const app = express(); 

console.log('✅ app.js loaded — setting up middleware and routes...');

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Log incoming requests
app.use((req, res, next) => {
    console.log(`📥 Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use(express.static(path.join(__dirname, 'view')));

app.post('/register', authController.register); 
app.post('/login', authController.login); 
app.post('/post-job', authController.postJob);

app.get('/', (req, res) => {
    console.log('➡️  Serving index.html');
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// Get jobs for search
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '270202',
    database: 'ProfileMe'
};
app.get('/get-jobs', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [jobs] = await connection.execute('SELECT * FROM jobs ORDER BY DatePosted DESC');
        await connection.end();
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// ✅ Profile and links endpoints — clean and correct
app.post('/save-profile', authController.saveUserProfile);
app.post('/add-link', authController.addUserLink);
app.post('/save-full-profile', authController.saveFullProfile);

app.get('/get-user-profile/:accountId', authController.getUserProfileAndLinks);

// Catch-all for unknown routes
app.use((req, res) => {
    console.log(`❓ Unhandled route: ${req.method} ${req.url}`);
    res.status(404).send('404 - Not Found');
});

// Connect to DB and start server
async function connectToDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to the database');

        const port = 3000;
        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('❗ Error connecting to the database:', error);
    }
}

connectToDB();