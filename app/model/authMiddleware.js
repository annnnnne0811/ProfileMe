function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    next();
}

module.exports = requireLogin;