const Student = require('../../models/Student');
const { hashPassword, comparePassword } = require('../../services/passwordService');
const { generateToken } = require('../../services/tokenService');

const registerStudent = async (req, res, next) => {
    try {
        const { name, rollNo, email, password } = req.body;

        const hashedPassword = await hashPassword(password);

        const student = await Student.create({
            name,
            rollNo,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'Student registered successfully',
            student: {
                id: student._id,
                name: student.name,
                rollNo: student.rollNo,
                email: student.email
            }
        });
    } catch (error) {
        next(error);
    }
};


const loginStudent = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email: email.toLowerCase() });

        if (!student || !(await comparePassword(password, student.password))) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = generateToken({
            id: student._id.toString(),
            role: 'student'
        });

        res.json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        next(error);
    }
};

const getStudentProfile = async (req, res, next) => {
    try {
        const student = await Student.findById(req.user.id)
            .select('-password');

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.json(student);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    registerStudent,
    loginStudent,
    getStudentProfile
};
