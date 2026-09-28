const express = require('express');
const router = express.Router();
const { getInventory, addProduct, updateStock } = require('../controllers/inventoryController');

router.get('/', getInventory);
router.post('/add', addProduct);
router.patch('/:id/stock', updateStock);

module.exports = router;