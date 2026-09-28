const express = require('express');
const router = express.Router();
const { processCheckout } = require('../controllers/posController');

router.post('/checkout', processCheckout);

module.exports = router;