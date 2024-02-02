const express = require('express');
const router = express.Router();

/* MIDDLEWARE TO VERIFY THE TOKEN OF LOGGEDIN USER */
// const verifyToken = require('../middlewares/verifyToken');

/* ROUTE CONFIGURATION FOR PRODUCT */
router.use('/products', require('../controllers/product/product-controller'));

module.exports = router;