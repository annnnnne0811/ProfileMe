// Import necessary modules
const express = require('express');
const authController = require('./controller/authController');
const upload = require('./controller/uploadController');
const path = require('path');
const mysql = require('mysql2/promise');
const session = require('express-session');

const app = express();

console.log('✅ app.js loaded — setting up middleware and routes...');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'view')));

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

// Log requests
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// Auth + API routes (no session)
app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

app.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload profile image
app.post('/upload/profile-image', upload.single('profilePic'), (req, res) => {
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
  });
  
  // Upload video
  app.post('/upload/profile-video', upload.single('profileVideo'), (req, res) => {
    res.json({ videoUrl: `/uploads/${req.file.filename}` });
  });

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