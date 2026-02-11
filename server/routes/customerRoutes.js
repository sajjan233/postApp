const express = require('express');
const router = express.Router();

const { selectAdmin,list } = require('../controllers/customerController');
const { auth } = require('../middleware/auth');

router.post('/select-admin', selectAdmin);
router.post('/',auth, list);

module.exports = router;


