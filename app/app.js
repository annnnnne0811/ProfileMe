const mysql = require('mysql2/promise');
const express = require('express');

const app = express(); 
app.use(express.json()); 

// db connection
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ProfileMe'
};

async function connectToDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to the database');

        // starts server
        const port = 3000;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

connectToDB();