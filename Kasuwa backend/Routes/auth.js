const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const registerValidation = [
  body('name').notEmpty().withMessage('Sunana yana da bukata'),
  body('email').isEmail().withMessage('Imel mai inganci'),
  body('password').isLength({ min: 6 }).withMessage('Kalmar sirri taƙaita haruffa 6')
];

const loginValidation = [
  body('email').isEmail().withMessage('Imel mai inganci'),
  body('password').exists().withMessage('Kalmar sirri tana da bukata')
];

// Routes
router.post('/register', protect, authorize('admin', 'manager'), registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

module.exports = router;
