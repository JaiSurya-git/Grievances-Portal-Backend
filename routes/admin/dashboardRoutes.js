const express = require('express');
const router = express.Router();

const {
    getDashboardStats
} = require('../../controllers/admin/dashboardController');

const authenticate = require('../../middleware/authenticate');
const requireAdmin = require('../../middleware/requireAdmin');

router.use(authenticate, requireAdmin);

router.get('/', getDashboardStats);

module.exports = router;