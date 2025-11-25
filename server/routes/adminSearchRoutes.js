const express = require('express');
const router = express.Router();
const { searchAdmins } = require('../controllers/adminSearchController');

router.get('/search', searchAdmins);

module.exports = router;


