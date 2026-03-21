const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addStock
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const productValidation = [
  body('name').notEmpty().trim(),
  body('category').notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('quantity').optional().isInt({ min: 0 })
];

router.get('/', protect, getProducts);
router.get('/:id', protect, getProduct);
router.post('/', protect, authorize('admin', 'manager'), productValidation, createProduct);
router.put('/:id', protect, authorize('admin', 'manager'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.post('/:id/stock', protect, authorize('admin', 'manager'), addStock);

module.exports = router;
