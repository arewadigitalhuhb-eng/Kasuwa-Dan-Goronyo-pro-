// Ƙirar lambar SKU ta atomatik
const generateSKU = (categoryCode, productId) => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${categoryCode}-${year}-${random}-${productId.toString().slice(-4)}`;
};

// Format kudi (Naira)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
};

// Rage kashi
const calculateDiscount = (amount, percentage) => {
  return amount - (amount * (percentage / 100));
};

// Kwanan wata
const formatDate = (date, format = 'DD/MM/YYYY') => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year);
};

// Paginate results
const paginate = async (model, query, options = {}) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(query);

  const results = await model.find(query)
    .skip(startIndex)
    .limit(limit)
    .sort(options.sort || '-createdAt');

  const pagination = {
    current: page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  };

  if (endIndex < total) {
    pagination.next = page + 1;
  }

  if (startIndex > 0) {
    pagination.prev = page - 1;
  }

  return {
    data: results,
    pagination
  };
};

// Generate report date range
const getDateRange = (period) => {
  const now = new Date();
  const start = new Date();
  
  switch(period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(now.getFullYear() - 1);
      break;
    default:
      start.setHours(0, 0, 0, 0);
  }
  
  return { start, end: now };
};

module.exports = {
  generateSKU,
  formatCurrency,
  calculateDiscount,
  formatDate,
  paginate,
  getDateRange
};
