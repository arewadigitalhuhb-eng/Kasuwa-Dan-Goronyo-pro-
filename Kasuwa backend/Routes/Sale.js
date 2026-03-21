const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getSales,
  getSale,
  createSale,
  makePayment,
  getSalesReport
} = require('../controllers/saleController');
const { protect, authorize } = require('../middleware/auth');

const saleValidation = [
  body('items').isArray({ min: 1 }).withMessage('Daya ko fiye da kayi'),
  body('items.*.productId').notEmpty(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('items.*.price').isFloat({ min: 0 }),
  body('paymentMethod').isIn(['cash', 'card', 'transfer', 'credit', 'mixed'])
];

router.get('/', protect, getSales);
router.get('/report', protect, authorize('admin', 'manager'), getSalesReport);
router.get('/:id', protect, getSale);
router.post('/', protect, saleValidation, createSale);
router.post('/:id/payment', protect, makePayment);

module.exports = router;
