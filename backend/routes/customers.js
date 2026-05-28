const express = require('express');
const router = express.Router();
const { getCustomers, getCustomerStats, getTopCustomers } = require('../controllers/customersController');

router.get('/', getCustomers);
router.get('/stats', getCustomerStats);
router.get('/top', getTopCustomers);

module.exports = router;
