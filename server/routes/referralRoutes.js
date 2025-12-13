const express = require("express");
const router = express.Router();
const { scanReferral } = require("../controllers/referralController");
const { auth, requireRole } = require('../middleware/auth');


router.post("/scan", auth, scanReferral);

module.exports = router;
