const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

const categoryValidation = [
  body('name').notEmpty().trim().isLength({ max: 50 })
];

router.get('/', protect, getCategories);
router.get('/:id', protect, getCategory);
router.post('/', protect, authorize('admin', 'manager'), categoryValidation, createCategory);
router.put('/:id', protect, authorize('admin', 'manager'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;
