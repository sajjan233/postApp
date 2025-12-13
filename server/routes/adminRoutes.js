const express = require('express');
const router = express.Router();
const { register, login, getAdminByKey,registeruser } = require('../controllers/adminController');
const { auth, requireRole } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/userregister', registeruser);
router.post('/login', login);
router.get('/by/:adminKey', getAdminByKey);

module.exports = router;


