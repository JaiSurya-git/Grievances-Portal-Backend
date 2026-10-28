const jwt = require('jsonwebtoken');

// Encrypts user details 
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'your_secret_key', {
        expiresIn: '1d',
    });
};

// JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    } catch (error) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };
