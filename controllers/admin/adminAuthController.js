const Admin = require('../../models/Admin');
const { comparePassword } = require('../../services/passwordService');
const { generateToken } = require('../../services/tokenService');

const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({
            email: email.toLowerCase()
        });

        if (!admin || !(await comparePassword(password, admin.password))) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = generateToken({
            id: admin._id.toString(),
            role: 'admin'
        });

        res.json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        next(error);
    }
};

const getAdminProfile = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.user.id)
            .select('-password');

        if (!admin) {
            return res.status(404).json({
                message: 'Admin not found'
            });
        }

        res.json(admin);
    } catch (error) {
        next(error);
    }
};

module.exports = { loginAdmin, getAdminProfile };
