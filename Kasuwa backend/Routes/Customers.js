const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerSales
} = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');

const customerValidation = [
  body('name').notEmpty().trim(),
  body('phone').notEmpty().trim()
];

router.get('/', protect, getCustomers);
router.get('/:id', protect, getCustomer);
router.get('/:id/sales', protect, getCustomerSales);
router.post('/', protect, customerValidation, createCustomer);
router.put('/:id', protect, updateCustomer);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteCustomer);

module.exports = router;
