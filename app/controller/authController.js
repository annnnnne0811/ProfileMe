const authModel = require('../model/authModel');
const bcrypt = require('bcrypt');

// Register new user
exports.register = async (req, res) => {
    console.log('🔥 Register endpoint hit! Body:', req.body);
    const { FirstName, LastName, Email, Password, DateOfBirth } = req.body;

    try {
        const existingUser = await authModel.findUserByEmail(Email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

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
        console.error('❌ Error during registration:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Login existing user
exports.login = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        const user = await authModel.findUserByEmail(Email);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(Password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

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
        console.error('❌ Error during login:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Post a new job
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
        console.error('❌ Error posting job:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Save or update basic user profile
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
        console.error('❌ Error saving profile data:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Get user profile + links
exports.getUserProfileAndLinks = async (req, res) => {
    const { accountId } = req.params;

    try {
        const data = await authModel.getUserProfileAndLinks(accountId);
        res.status(200).json(data);
    } catch (error) {
        console.error('❌ Error fetching profile and links:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Add single link (optional, used for inline editing)
exports.addUserLink = async (req, res) => {
    const { ProfileID, iconClass, linkText, linkUrl } = req.body;

    try {
        await authModel.addUserLink(ProfileID, iconClass, linkText, linkUrl);
        res.status(201).json({ message: 'Link added successfully!' });
    } catch (error) {
        console.error('❌ Error adding link:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.saveFeed = async (req, res) => {
    const { AccountID, feedText } = req.body;
    console.log('Received in saveFeed:', { AccountID, feedText }); // Debug

    try {
        await authModel.createOrUpdateUserProfile(AccountID, { feed_text: feedText });
        // Verify the save
        const { profile } = await authModel.getUserProfileAndLinks(AccountID);
        if (profile.FeedText !== feedText) {
            throw new Error('FeedText was not saved correctly');
        }
        res.status(200).json({ message: 'Feed saved successfully!' });
    } catch (error) {
        console.error('❌ Error saving feed:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Save About Me (BioText)
exports.saveAboutMe = async (req, res) => {
    const { AccountID, description } = req.body;

    try {
        await authModel.createOrUpdateUserProfile(AccountID, { description });
        res.status(200).json({ message: 'About Me saved successfully!' });
    } catch (error) {
        console.error('❌ Error saving About Me:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Save Profile Video
exports.saveProfileVideo = async (req, res) => {
    const { AccountID, profile_video_url } = req.body;

    try {
        await authModel.createOrUpdateUserProfile(AccountID, { profile_video_url });
        res.status(200).json({ message: 'Profile video saved successfully!' });
    } catch (error) {
        console.error('❌ Error saving profile video:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Save Useful Links (already exists as saveFullProfile, but we can make it specific)
exports.saveUsefulLinks = async (req, res) => {
    const { AccountID, links } = req.body;

    try {
        const userProfile = await authModel.getUserProfileAndLinks(AccountID);
        const ProfileID = userProfile.profile?.ProfileID;

        if (ProfileID) {
            await authModel.deleteLinksForProfile(ProfileID);
            for (const link of links) {
                await authModel.addUserLink(ProfileID, link.iconClass, link.linkName, link.linkUrl);
            }
        }

        res.status(200).json({ message: 'Useful links saved successfully!' });
    } catch (error) {
        console.error('❌ Error saving useful links:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};