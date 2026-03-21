const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { validationResult } = require('express-validator');

// Rajistar mai amfani
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password, role, phone } = req.body;

    // Duba ko mai amfani ya riga ya wanzu
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Wannan imel ya riga ya wanzu'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'seller',
      phone,
      createdBy: req.user ? req.user.id : null
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Shiga
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Duba imel da kalmar sirri
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Imel ko kalmar sirri ba daidai ba'
      });
    }

    // Duba ko asusun yana aiki
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Asusunka ya daina aiki'
      });
    }

    // Daidaita kalmar sirri
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Imel ko kalmar sirri ba daidai ba'
      });
    }

    // Sabunta lastLogin
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Samun bayanan mai amfani
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Sabunta bayanan mai amfani
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Canza kalmar sirri
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Daidaita tsohuwar kalmar sirri
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Tsohuwar kalmar sirri ba daidai ba'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Kalmar sirri ta canza cikin nasara'
    });
  } catch (error) {
    next(error);
  }
};
        
