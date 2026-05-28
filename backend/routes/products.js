const express = require('express');
const router = express.Router();
const { getProducts, getTopProducts, getLowStock } = require('../controllers/productsController');

router.get('/', getProducts);
router.get('/top', getTopProducts);
router.get('/low-stock', getLowStock);

module.exports = router;
