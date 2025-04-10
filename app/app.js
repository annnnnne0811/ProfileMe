// Required external modules
const authController = require('./controller/authController');
const upload = require('./controller/uploadController');
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const session = require('express-session');
const fs = require('fs');

const app = express();
console.log('✅ app.js loaded — setting up middleware and routes...');

// Makes sure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'view')));

// Session configuration
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax'
    }
}));

// Logs requests
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// Authentication routes
app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Session check endpoint
app.get('/check-session', (req, res) => {
    console.log('🔍 Checking session:', req.session);
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
});

// Static route for uploaded files
app.use('/uploads', (req, res, next) => {
    console.log(`📂 Serving file: ${req.url}`);
    next();
}, express.static(path.join(__dirname, 'uploads')));

// Profile image handler
app.post('/upload/profile-image', upload.single('profilePic'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
});
  
// Profile video handler
app.post('/upload/profile-video', upload.single('profileVideo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ videoUrl: `/uploads/${req.file.filename}` });
});

// Profile content routes
app.post('/save-profile', authController.saveUserProfile);
app.post('/add-link', authController.addUserLink);
app.get('/get-user-profile/:accountId', authController.getUserProfileAndLinks);
app.post('/save-feed', authController.saveFeed);
app.post('/save-about-me', authController.saveAboutMe);
app.post('/save-profile-video', authController.saveProfileVideo);
app.post('/save-useful-links', authController.saveUsefulLinks);

// HTML view routing
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
    password: 'root',
    database: 'ProfileMe'
};

// Fetch all job postings
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

// Adds a new job posting
app.post('/post-job', async (req, res) => {
    try {
        const { title, description, location } = req.body;

        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO jobs (Title, Description, Location, DatePosted) VALUES (?, ?, ?, NOW())',
            [title, description, location]
        );
        await connection.end();

        res.status(200).json({ message: 'Job posted successfully.' });
    } catch (err) {
        console.error('❌ Job post error:', err);
        res.status(500).json({ message: 'Failed to post job.' });
    }
});

// Fetch all users and their profile videos
app.get('/get-people', async (req, res) => {
    try {
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.execute(`
        SELECT a.FirstName, a.LastName, a.Email, up.ProfileVideo 
        FROM account a
        LEFT JOIN user_profile up ON a.AccountID = up.AccountID
      `);
      await connection.end();
      res.json(rows);
    } catch (error) {
      console.error('❌ Error fetching people:', error);
      res.status(500).json({ message: 'Failed to fetch people.' });
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