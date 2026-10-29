const jwt = require('jsonwebtoken');

const getSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }
    return process.env.JWT_SECRET;
};

const generateToken = (payload) => {
    return jwt.sign(payload, getSecret(), {
        expiresIn: '1d'
    });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, getSecret());
    } catch (error) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };