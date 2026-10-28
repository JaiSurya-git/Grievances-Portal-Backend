const validateAuth = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!email.endsWith('.edu')) { 
        return res.status(400).json({ message: 'Registration restricted to valid college email domains' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    next();
};

module.exports = validateAuth;
