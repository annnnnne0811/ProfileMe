// Import necessary modules
const express = require('express');
const authController = require('./controller/authController'); 
const path = require('path'); 

const app = express(); 

app.use(express.json()); 

// gets static files from the 'view'
app.use(express.static(path.join(__dirname, 'view')));

// API routes
app.post('/register', authController.register); 
app.post('/login', authController.login); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ProfileMe'
};

// tests database connection and starts server
async function connectToDB() {
    try {
        const connection = await require('mysql2/promise').createConnection(dbConfig);
        console.log('Connected to the database');

        // start server on port 3000
        const port = 3000;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

connectToDB();
