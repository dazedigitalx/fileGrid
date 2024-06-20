const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authenticate = (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: No token provided'
        });
    }

    // Extract token from Authorization header
    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user; // Attach decoded user payload to request object
        next(); // Proceed to next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid token'
        });
    }
};

module.exports = { authenticate };
