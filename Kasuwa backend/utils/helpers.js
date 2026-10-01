/**
 * Utility helper functions for backend operations
 */

/**
 * Paginate query results
 * @param {Model} model - Mongoose model
 * @param {Object} query - MongoDB query filter
 * @param {Object} options - Pagination options { page, limit, sort }
 * @returns {Promise<{data: Array, pagination: Object}>}
 */
exports.paginate = async (model, query = {}, options = {}) => {
  const page = Math.max(1, parseInt(options.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(options.limit) || 10));
  const skip = (page - 1) * limit;
  const sort = options.sort || '-createdAt';

  const total = await model.countDocuments(query);
  const data = await model
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

/**
 * Generate unique invoice number
 * @returns {string}
 */
exports.generateInvoiceNumber = () => {
  const date = new Date();
  const prefix = 'INV';
  const timestamp = date.getTime().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Calculate profit from sale
 * @param {Array} items - Sale items with price, costPrice, quantity
 * @param {Number} discount - Discount amount
 * @returns {Number}
 */
exports.calculateProfit = (items, discount = 0) => {
  const revenue = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  const cost = items.reduce((sum, item) => {
    return sum + (item.costPrice * item.quantity);
  }, 0);
  
  return revenue - cost - discount;
};

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
exports.isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone
 * @returns {boolean}
 */
exports.isValidPhone = (phone) => {
  const regex = /^[0-9]{10,15}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

/**
 * Sanitize string to prevent injection
 * @param {string} str
 * @returns {string}
 */
exports.sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, 500);
};

/**
 * Check if user has required role
 * @param {string} userRole
 * @param {Array<string>} requiredRoles
 * @returns {boolean}
 */
exports.hasRole = (userRole, requiredRoles = []) => {
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }
  return requiredRoles.includes(userRole);
};

/**
 * Format response for consistency
 * @param {boolean} success
 * @param {*} data
 * @param {string} message
 * @returns {Object}
 */
exports.apiResponse = (success, data = null, message = '') => {
  return {
    success,
    message,
    data
  };
};

/**
 * Get standard error response
 * @param {string} message
 * @param {number} statusCode
 * @returns {Object}
 */
exports.apiError = (message, statusCode = 500) => {
  return {
    success: false,
    message,
    statusCode
  };
};
