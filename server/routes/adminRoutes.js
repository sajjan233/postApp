const express = require('express');
const router = express.Router();
const { register, login, getAdminByKey } = require('../controllers/adminController');
const { auth, requireRole } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/:adminKey', getAdminByKey);

module.exports = router;


