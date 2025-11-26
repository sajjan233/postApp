// routes/category.routes.js
const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController.js");

router.post("/", createCategory);          // Create
router.get("/", getCategories);            // List all
router.get("/:id", getCategoryById);       // Single category
router.put("/:id", updateCategory);        // Update
router.delete("/:id", deleteCategory);     // Delete

module.exports = router;
