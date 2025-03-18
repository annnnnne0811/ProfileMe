const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '270202',
    database: 'ProfileMe'
};

// contains static methods for DB operations
class AuthModel {
    // creates connection to DB
    static async createConnection() {
        return await mysql.createConnection(dbConfig);
    }

    // Find user by email
    static async findUserByEmail(email) {
        const connection = await this.createConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT AccountID, FirstName, LastName, Email, Password, DateOfBirth FROM account WHERE Email = ?',
                [email]
            );
            return rows[0] || null; // Return user or null if not found
        } finally {
            await connection.end(); // Always close connection
        }
    }

    // creates new user account in DB
    static async createAccount({ FirstName, LastName, Email, Password, DateOfBirth }) {
        const connection = await this.createConnection();
        try {
            const [result] = await connection.execute(
                'INSERT INTO account (FirstName, LastName, Email, Password, DateOfBirth) VALUES (?, ?, ?, ?, ?)',
                [FirstName, LastName, Email, Password, DateOfBirth]
            );
            return result.insertId; // return ID of new account
        } finally {
            await connection.end(); 
        }
    }
}

// export model
module.exports = AuthModel;
