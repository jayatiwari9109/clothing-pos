const express = require('express');
const router = express.Router();
const { searchCustomers, addCustomer } = require('../controllers/customerController');

router.get('/search', searchCustomers);
router.post('/add', addCustomer);

module.exports = router;