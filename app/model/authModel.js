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
    // Save or update user profile in DB
    static async createOrUpdateUserProfile(AccountID, profileData) {
        const connection = await this.createConnection();
        const { description, displayed_location, profile_picture_url, profile_video_url } = profileData;
        try {
            await connection.execute(
                `
                INSERT INTO user_profile (AccountID, ProfileImage, ProfileVideo, BioText, DisplayLocation)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    ProfileImage = COALESCE(VALUES(ProfileImage), ProfileImage),
                    ProfileVideo = COALESCE(VALUES(ProfileVideo), ProfileVideo),
                    BioText = COALESCE(VALUES(BioText), BioText),
                    DisplayLocation = COALESCE(VALUES(DisplayLocation), DisplayLocation)
                `,
                [AccountID, profile_picture_url, profile_video_url, description, displayed_location]
            );
        } catch (error) {
            console.error("Error saving user profile:", error.sqlMessage || error);
            throw error;
        } finally {
            await connection.end();
        }
    }

// Add a new user link (using ProfileID and correct fields)
static async addUserLink(ProfileID, iconClass, linkText, linkUrl) {
    const connection = await this.createConnection();
    try {
        await connection.execute(
            'INSERT INTO user_links (ProfileID, IconClass, LinkName, LinkURL) VALUES (?, ?, ?, ?)',
            [ProfileID, iconClass, linkText, linkUrl]
          );
    } finally {
        await connection.end();
    }
}

// Fetch all links for a given profile
static async getUserLinks(ProfileID) {
    const connection = await this.createConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT LinkID, IconClass, LinkName, LinkURL FROM user_links WHERE ProfileID = ?',
            [ProfileID]
        );
        return rows;
    } finally {
        await connection.end();
    }
}

// Fetch profile by ProfileID (safer if linking by profiles)
static async getUserProfileAndLinksByProfileID(ProfileID) {
    const connection = await this.createConnection();
    try {
        const [profile] = await connection.execute(
            'SELECT * FROM user_profile WHERE ProfileID = ?', [ProfileID]
        );
        const [links] = await connection.execute(
            'SELECT IconClass, LinkName, LinkURL FROM user_links WHERE ProfileID = ?', [ProfileID]
        );
        return { profile: profile[0], links };
    } finally {
        await connection.end();
    }
}



}


// export model
module.exports = AuthModel;
