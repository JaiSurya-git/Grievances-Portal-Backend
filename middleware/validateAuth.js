
const validateAuth = (req, res, next) => {
    const { email, password, rollNo } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'Invalid email format'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: 'Password must be at least 6 characters long'
        });
    }

    if (req.originalUrl.startsWith('/api/auth/admin')) {
        return next();
    }

    const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN;

    if (!allowedDomain) {
        return res.status(500).json({
            message: 'Email domain configuration is missing'
        });
    }

    if (email.split('@')[1].toLowerCase() !== allowedDomain.trim().toLowerCase()) {
        return res.status(400).json({
            message: 'Registration restricted to valid college email domains'
        });
    }

    if (req.originalUrl.endsWith('/register')) {
        if (!rollNo || !/^25Z\d{3}$/i.test(rollNo.trim())) {
            return res.status(400).json({
                message: 'Roll number must be in the format 25Z followed by 3 digits'
            });
        }
    }

    next();
};

module.exports = validateAuth;
