// Example authentication middleware setting req.user after decoding JWT
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).send('Authorization header missing');
    }

    try {
        const token = authHeader.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send('Token missing');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Set decoded user information on req.user
        console.log('Current user:', req.user); // Verify user information
        next();
    } catch (error) {
        res.status(401).send('Invalid token');
        console.error('Error verifying token:', error);
    }
};

module.exports = authMiddleware;
