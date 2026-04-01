const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { createRecord, getRecords, updateRecord, deleteRecord } = require('../controllers/recordController');

// All record routes require authentication
router.use(authMiddleware);

// Only admins and analysts can view, but maybe viewers too?
// PRD says: "Viewer: can only view dashboard data" -> means they can't view records directly?
// Let's assume Viewer only sees dashboard. Analyst and Admin can view records. Admin full CRUD.
// For now, let's keep getRecords open to Analyst/Admin. Viewer gets blocked.
router.get('/', roleMiddleware(['analyst', 'admin']), getRecords);
router.post('/', roleMiddleware(['admin']), createRecord);
router.put('/:id', roleMiddleware(['admin']), updateRecord);
router.delete('/:id', roleMiddleware(['admin']), deleteRecord);

module.exports = router;
