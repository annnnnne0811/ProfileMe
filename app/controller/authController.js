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

        // saves sesh after registration
        req.session.user = {
            AccountID: newAccountID,
            FirstName,
            LastName
        };

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

        // user session 
        req.session.user = {
            AccountID: user.AccountID,
            FirstName: user.FirstName,
            LastName: user.LastName
        };

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

// logout of user session
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed.' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully.' });
    });
};

// checks if user in session
exports.checkSession = (req, res) => {
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(401).json({ message: 'Not logged in' });
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

// Get user profile and links using the correct function
exports.getUserProfileAndLinks = async (req, res) => {
    const { accountId } = req.params;

    try {
        const data = await authModel.getUserProfileAndLinks(accountId);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching user profile and links:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Add user link
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

// Save full profile data and links using the correct function to fetch profile
exports.saveFullProfile = async (req, res) => {
    const { AccountID, profileData, links } = req.body;

    try {
        // Save or update profile data
        await authModel.createOrUpdateUserProfile(AccountID, profileData);

        // Get ProfileID from the user's profile using the correct function
        const userProfile = await authModel.getUserProfileAndLinks(AccountID);
        const ProfileID = userProfile.profile?.ProfileID;

        if (ProfileID) {
            // Delete old links and add new ones
            await authModel.deleteLinksForProfile(ProfileID);
            for (const link of links) {
                await authModel.addUserLink(ProfileID, link.iconClass, link.linkName, link.linkUrl);
            }
        }

        res.status(200).json({ message: 'Full profile and links saved successfully!' });
    } catch (error) {
        console.error('Error saving full profile:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.getUserProfileByAccountId = async (req, res) => {
    const { accountId } = req.params;
    try {
        const data = await authModel.getUserProfileAndLinks(accountId);
        res.json(data);
    } catch (err) {
        console.error('Error loading profile:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};