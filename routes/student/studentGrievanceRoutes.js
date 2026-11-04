const express = require('express');
const router = express.Router();

const authenticate = require('../../middleware/authenticate');
const requireStudent = require('../../middleware/requireStudent');
const validateGrievance = require('../../middleware/validateGrievance');
const ownGrievanceOnly = require('../../middleware/ownGrievanceOnly');
const upload = require('../../middleware/upload');

const {
    submitGrievance,
    getMyGrievances,
    getOneGrievance,
    uploadAttachment,
    downloadAttachment
} = require('../../controllers/student/studentGrievanceController');

// All routes require student authentication
router.use(authenticate, requireStudent);

// Submit grievance
router.post('/', validateGrievance, submitGrievance);

// Get all my grievances
router.get('/', getMyGrievances);

// Get one grievance
router.get('/:id', ownGrievanceOnly, getOneGrievance);

// Upload an attachment
router.post('/:id/attachment', upload.single('attachment'), uploadAttachment);

// Download an attachment
router.get('/:id/attachment/:attachmentId', downloadAttachment);

module.exports = router;