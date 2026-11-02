
const express = require('express');
const router = express.Router();

const {
    loginAdmin,
    getAdminProfile
} = require('../../controllers/admin/adminAuthController');

const validateAuth = require('../../middleware/validateAuth');
const authenticate = require('../../middleware/authenticate');
const requireAdmin = require('../../middleware/requireAdmin');

router.post('/login', validateAuth, loginAdmin);
router.get('/me', authenticate, requireAdmin, getAdminProfile);

module.exports = router;
