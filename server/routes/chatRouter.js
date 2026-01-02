const express = require("express");
const router = express.Router();
const { userchat } = require("../controllers/chat");

const { auth } = require('../middleware/auth');


router.post('/list',auth, userchat);

module.exports = router;