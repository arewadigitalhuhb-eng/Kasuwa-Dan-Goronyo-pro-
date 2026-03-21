const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Tabbatar da mai amfani
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Samun token
      token = req.headers.authorization.split(' ')[1];

      // Tabbatance token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Samun bayanan mai amfani
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Mai amfani ba a samu ba'
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Asusunka ya daina aiki, tuntubi admin'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Ba a izini ba, token ba daidai ba'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Ba a izini ba, babu token'
    });
  }
};

// Tabbatance matsayi (Role)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Matsayin ${req.user.role} ba ya izinin wannan aikin`
      });
    }
    next();
  };
};

// Samar da JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

module.exports = { protect, authorize, generateToken };
