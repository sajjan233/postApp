// routes/category.routes.js
const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getActiveCategories
} = require("../controllers/categoryController.js");
const { auth } = require("../middleware/auth.js");

router.post("/", createCategory);          // Create
router.get("/", auth,getCategories);            // List all
router.get("/list",auth, getActiveCategories);            // List all
router.get("/:id", getCategoryById);       // Single category
router.put("/:id", updateCategory);        // Update
router.delete("/:id", deleteCategory);     // Delete

module.exports = router;
