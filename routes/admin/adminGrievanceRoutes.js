const express = require('express');
const router = express.Router();

const {
    getAllGrievances,
    getOneGrievance,
    addRemark,
    updateStatus,
    downloadAttachment
} = require('../../controllers/admin/adminGrievanceController');

const authenticate = require('../../middleware/authenticate');
const requireAdmin = require('../../middleware/requireAdmin');

router.use(authenticate, requireAdmin);

router.get('/', getAllGrievances);
router.get('/:id', getOneGrievance);
router.post('/:id/remarks', addRemark);
router.patch('/:id/status', updateStatus);

// Download grievance attachment (Admin)
router.get('/:id/attachment/:attachmentId', downloadAttachment);

module.exports = router;