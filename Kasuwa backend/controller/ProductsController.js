const Product = require('../models/Product');
const { paginate, generateSKU } = require('../utils/helpers');
const { validationResult } = require('express-validator');

// Samu duk kayayyaki
exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, lowStock, minPrice, maxPrice } = req.query;
    
    let query = { isActive: true };
    
    // Bincike
    if (search) {
      query.$text = { $search: search };
    }
    
    // Tace ta rukuni
    if (category) {
      query.category = category;
    }
    
    // Tace ta farashi
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Kayan da suka ƙasa
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$quantity', '$minQuantity'] };
    }

    const result = await paginate(Product, query, {
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sort || '-createdAt'
    });

    // Populate category
    await Product.populate(result.data, { path: 'category', select: 'name' });

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

// Samu kayan ta ID
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('createdBy', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ba a samu kayan ba'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Ƙirar sabon kayi
exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    req.body.createdBy = req.user.id;

    // Ƙirar SKU idan ba a ba ba
    if (!req.body.sku && req.body.category) {
      const categoryCode = req.body.category.toString().slice(-3).toUpperCase();
      req.body.sku = generateSKU(categoryCode, Date.now());
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Sabunta kayi
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ba a samu kayan ba'
      });
    }

    // Hana canza wanda ya ƙirƙira
    delete req.body.createdBy;

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Share kayi (Soft delete)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ba a samu kayan ba'
      });
    }

    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'An share kayan cikin nasara'
    });
  } catch (error) {
    next(error);
  }
};

// Ƙara yawan kayayyaki (Stock in)
exports.addStock = async (req, res, next) => {
  try {
    const { quantity, costPrice, notes } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ba a samu kayan ba'
      });
    }

    // Sabunta yawan da farashin saya
    const oldQuantity = product.quantity;
    product.quantity += Number(quantity);
    
    if (costPrice) {
      // Weighted average cost
      const totalCost = (oldQuantity * product.costPrice) + (quantity * costPrice);
      product.costPrice = totalCost / product.quantity;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: `An ƙara rumbuna da yawan ${quantity}`,
      data: {
        previousQuantity: oldQuantity,
        newQuantity: product.quantity,
        added: quantity
      }
    });
  } catch (error) {
    next(error);
  }
};
        
