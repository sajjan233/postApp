const express = require("express");
const router = express.Router();
const {
    createQuery,
    getMyQueries,
    getAllQueries,
    updateQueryByAdmin
} = require("../controllers/queryController");

const { auth, requireRole } = require("../middleware/auth");

// USER (NO LOGIN)
router.post("/create",auth, createQuery);
router.get("/my",auth, getMyQueries);

// ADMIN
router.get(
    "/all",
    auth,
    requireRole("masterAdmin"),
    getAllQueries
);

router.put(
    "/update/:id",
    auth,
    requireRole("masterAdmin"),
    updateQueryByAdmin
);

module.exports = router;
