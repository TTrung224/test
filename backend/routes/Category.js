const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/VerifyToken');
const adminAuth = require('../middleware/AdminAuth');
const CategoryController = require('../controllers/CategoryController');

router.get("/", CategoryController.getAllCategories)
router.get("/:categoryId", CategoryController.getCategoryWithParents)
router.post("/add", verifyToken, adminAuth, CategoryController.addCategory)
router.put("/edit/:categoryId", verifyToken, adminAuth, CategoryController.updateCategory)
router.delete("/delete/:categoryId", verifyToken, adminAuth, CategoryController.deleteCategory)

module.exports = router;