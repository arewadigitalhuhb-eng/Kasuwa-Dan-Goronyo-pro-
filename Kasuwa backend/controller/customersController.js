const Customer = require('../models/Customer');
const { paginate } = require('../utils/helpers');

// Samu duk abokan ciniki
exports.getCustomers = async (req, res, next) => {
  try {
    const { search, type } = req.query;
    
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (type) query.type = type;

    const result = await paginate(Customer, query, {
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sort || '-createdAt'
    });

    res.status(200).json({
      success: true,
      count: result.data.length,
      pagination: result.pagination,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

// Samu abokin ciniki ta ID
exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Ba a samu abokin ciniki ba'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// Ƙirar abokin ciniki
exports.createCustomer = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    
    const customer = await Customer.create(req.body);

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// Sabunta abokin ciniki
exports.updateCustomer = async (req, res, next) => {
  try {
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Ba a samu abokin ciniki ba'
      });
    }

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// Share abokin ciniki
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Ba a samu abokin ciniki ba'
      });
    }

    // Duba ko yana da bashi
    if (customer.currentCredit > 0) {
      return res.status(400).json({
        success: false,
        message: `Ba za a iya share shi ba saboda yana da bashin ${customer.currentCredit}`
      });
    }

    customer.isActive = false;
    await customer.save();

    res.status(200).json({
      success: true,
      message: 'An share abokin ciniki cikin nasara'
    });
  } catch (error) {
    next(error);
  }
};

// Samu tarihin sayayya na abokin ciniki
exports.getCustomerSales = async (req, res, next) => {
  try {
    const Sale = require('../models/Sale');
    
    const sales = await Sale.find({ customer: req.params.id })
      .populate('soldBy', 'name')
      .sort('-soldAt');

    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    next(error);
  }
};
      
