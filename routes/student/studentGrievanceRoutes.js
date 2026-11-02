const express = require('express');
const router = express.Router();

const authenticate = require('../../middleware/authenticate');
const requireStudent = require('../../middleware/requireStudent');
const validateGrievance = require('../../middleware/validateGrievance');
const ownGrievanceOnly = require('../../middleware/ownGrievanceOnly');

const {
    submitGrievance,
    getMyGrievances,
    getOneGrievance
} = require('../../controllers/student/studentGrievanceController');

// All routes require student authentication
router.use(authenticate, requireStudent);

// Submit grievance
router.post('/', validateGrievance, submitGrievance);

// Get all my grievances
router.get('/', getMyGrievances);

// Get one grievance
router.get('/:id', ownGrievanceOnly, getOneGrievance);

module.exports = router;