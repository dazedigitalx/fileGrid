const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure this is called to load .env variables

const { ACCESS_TOKEN_SECRET } = process.env;

// console.log('Error :', ACCESS_TOKEN_SECRET); // Debug log

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Split Bearer token format
        try {
            const user = jwt.verify(token, ACCESS_TOKEN_SECRET);
            req.user = user; // Attach decoded user information to request object
            req.user.id = user.id || user.userId;

            next();
        } catch (err) {
            console.error('JWT verification error:', err.message);
            res.status(403).json({ message: 'Invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Authorization header required' });
    }
};

module.exports = authMiddleware;
