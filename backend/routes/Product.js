const express = require('express');
const router = express.Router();
const multer = require('multer');
const ProductController = require('../controllers/ProductController');
const verifyToken = require('../middleware/VerifyToken');
const sellerAuth = require('../middleware/SellerAuth');


router.get("/", ProductController.getAllProducts)
router.get("/item/:productId", ProductController.getProduct)

// SELLER AUTH REQUIRED
router.use(verifyToken)
router.get("/seller/:userId", ProductController.getUserProducts)
router.get("/statistic", ProductController.getProductStat)

// SELLER STATUS "ACCEPTED" REQUIRED
router.use(sellerAuth)
const upload = multer({dest: "./productImgs/"})
router.post("/add", upload.single("productImg"), ProductController.addProduct)
router.post("/edit/:productId", upload.single("productImg"),ProductController.editProduct)
router.delete("/delete/:productId", ProductController.deleteProduct)

module.exports = router;