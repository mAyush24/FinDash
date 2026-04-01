const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');

// All user management requires authentication and ADMIN role
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
