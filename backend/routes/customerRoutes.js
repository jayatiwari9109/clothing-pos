const express = require('express');
const router = express.Router();
const {
  createCustomer,
  searchCustomers,
  getCustomerLedger,
  receiveUdhaarPayment
} = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createCustomer);
router.get('/search', authMiddleware, searchCustomers);
router.get('/ledger/:customerId', authMiddleware, getCustomerLedger);
router.post('/pay-udhaar', authMiddleware, receiveUdhaarPayment);

module.exports = router;