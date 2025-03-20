// Import necessary modules
const express = require('express');
const authController = require('./controller/authController'); 
const path = require('path'); 

const app = express(); 

console.log('✅ app.js loaded — setting up middleware and routes...');

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Also handle URL-encoded data, just in case!

// Log all incoming requests for debugging
app.use((req, res, next) => {
    console.log(`📥 Incoming request: ${req.method} ${req.url}`);
    next();
});

// gets static files from the 'view'
app.use(express.static(path.join(__dirname, 'view')));

// API routes
console.log('✅ Register route ready at /register');
app.post('/register', authController.register); 

console.log('✅ Login route ready at /login');
app.post('/login', authController.login); 

console.log('✅ Post-job route ready at /post-job');
app.post('/post-job', authController.postJob);

app.get('/', (req, res) => {
    console.log('➡️  Serving index.html');
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// New endpoint to get job listings for the search tab
app.get('/get-jobs', async (req, res) => {
    try {
        const connection = await require('mysql2/promise').createConnection(dbConfig);
        const [jobs] = await connection.execute('SELECT * FROM jobs ORDER BY DatePosted DESC');
        await connection.end();
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});



// Catch-all for unknown routes
app.use((req, res) => {
    console.log(`❓ Unhandled route: ${req.method} ${req.url}`);
    res.status(404).send('404 - Not Found');
});

// database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '270202',
    database: 'ProfileMe'
};

// tests database connection and starts server
async function connectToDB() {
    try {
        const connection = await require('mysql2/promise').createConnection(dbConfig);
        console.log('✅ Connected to the database');

        // start server on port 3000
        const port = 3000;
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    } catch (error) {
        console.error('❗ Error connecting to the database:', error);
    }
}

connectToDB();