const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/VerifyToken');
const accountController = require('../controllers/AccountController');
const adminAuth = require('../middleware/AdminAuth');
const CartController = require('../controllers/CartController');
const userAuth = require('../middleware/UserAuth');
// const technician_auth = require('../middleware/technician_auth')

router.post('/login', accountController.login);
router.post('/signup', accountController.register);

router.use(verifyToken)
router.post('/logout', accountController.logout);
router.get('/seller-request', adminAuth, accountController.getAllSellerRequest);
router.put('/seller-request/:sellerId', adminAuth, accountController.updateSellerRequestStatus);
router.get('/', accountController.getUser);

router.get('/cart', userAuth, CartController.getCart)
router.post('/cart/update', userAuth, CartController.updateCart)

module.exports = router;