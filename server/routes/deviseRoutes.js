const { saveToken } = require("../controllers/devicce");

const express = require("express");
const router = express.Router();

const { auth } = require('../middleware/auth');


router.post('/token-save', saveToken);

module.exports = router;