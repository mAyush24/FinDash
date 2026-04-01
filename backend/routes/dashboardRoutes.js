const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { getDashboardMetrics } = require('../controllers/dashboardController');

router.use(authMiddleware);

// All roles can view dashboard data
router.get('/', roleMiddleware(['viewer', 'analyst', 'admin']), getDashboardMetrics);

module.exports = router;
