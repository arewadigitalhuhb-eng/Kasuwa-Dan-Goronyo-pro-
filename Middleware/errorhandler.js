const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field} ya riga ya wanzu`;
    return res.status(400).json({
      success: false,
      message: error.message,
      field: field
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Kuskure a cikin bayanan',
      errors: messages
    });
  }

  // Mongoose cast error (ObjectId mara kyau)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Ba a samu abu mai ID ${err.value} ba`
    });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token mara kyau'
    });
  }

  // JWT expire
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token ya ƙare'
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || 'Kuskuren saba',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
