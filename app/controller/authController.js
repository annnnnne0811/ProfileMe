const authModel = require('../model/authModel');
const bcrypt = require('bcrypt');

// registers new user
exports.register = async (req, res) => {
    console.log('🔥 Register endpoint hit! Body:', req.body);
    const { FirstName, LastName, Email, Password, DateOfBirth } = req.body;

    try {
        // checks if user already exists
        const existingUser = await authModel.findUserByEmail(Email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        // hashes password before saving
        const hashedPassword = await bcrypt.hash(Password, 10);

        // creates new account
        const newAccountID = await authModel.createAccount({
            FirstName,
            LastName,
            Email,
            Password: hashedPassword,
            DateOfBirth
        });

        res.status(201).json({ 
            message: 'Account created successfully!', 
            AccountID: newAccountID,
            FirstName,
            LastName
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// login existing user
exports.login = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        // finds user by email
        const user = await authModel.findUserByEmail(Email);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // validates password
        const isPasswordValid = await bcrypt.compare(Password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        res.status(200).json({ 
            message: 'Login successful!',
            AccountID: user.AccountID,
            FirstName: user.FirstName,
            LastName: user.LastName
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.postJob = async (req, res) => {
    const { Title, Description, Location } = req.body;

    try {
        const connection = await authModel.createConnection();
        await connection.execute(
            'INSERT INTO jobs (Title, Description, Location) VALUES (?, ?, ?)',
            [Title, Description, Location]
        );
        await connection.end();
        res.status(201).json({ message: 'Job posted successfully!' });
    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Save or update user profile data
exports.saveUserProfile = async (req, res) => {
    const { AccountID, description, displayed_location, profile_picture_url, profile_video_url } = req.body;

    try {
        await authModel.createOrUpdateUserProfile(AccountID, {
            description,
            displayed_location,
            profile_picture_url,
            profile_video_url
        });
        res.status(200).json({ message: 'Profile data saved successfully!' });
    } catch (error) {
        console.error('Error saving profile data:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Add user link
exports.addUserLink = async (req, res) => {
    const { AccountID, link_name, link_url } = req.body;

    try {
        await authModel.addUserLink(AccountID, link_name, link_url);
        res.status(200).json({ message: 'Link added successfully!' });
    } catch (error) {
        console.error('Error adding link:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Get user profile and links
exports.getUserProfile = async (req, res) => {
    const { AccountID } = req.params;

    try {
        const data = await authModel.getUserProfileAndLinks(AccountID);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.addUserLink = async (req, res) => {
    const { ProfileID, iconClass, linkText, linkUrl } = req.body;

    try {
        await authModel.addUserLink(ProfileID, iconClass, linkText, linkUrl);
        res.status(201).json({ message: 'Link added successfully!' });
    } catch (error) {
        console.error('Error adding user link:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.getUserProfileAndLinks = async (req, res) => {
    const { profileId } = req.params;

    try {
        const data = await authModel.getUserProfileAndLinksByProfileID(profileId);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching user profile and links:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};