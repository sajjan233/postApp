const express = require('express');
const router = express.Router();
const { selectAdmin } = require('../controllers/customerController');

router.post('/select-admin', selectAdmin);

module.exports = router;


