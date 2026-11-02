
const express = require('express');
const router = express.Router();

const {
    registerStudent,
    loginStudent,
    getStudentProfile
} = require('../../controllers/student/studentAuthController');

const validateAuth = require('../../middleware/validateAuth');
const authenticate = require('../../middleware/authenticate');
const requireStudent = require('../../middleware/requireStudent');

router.post('/register', validateAuth, registerStudent);
router.post('/login', validateAuth, loginStudent);
router.get('/me', authenticate, requireStudent, getStudentProfile);

module.exports = router;
