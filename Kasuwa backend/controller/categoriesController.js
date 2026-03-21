const Category = require('../models/Category');

// Samu duk rukuni
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('createdBy', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// Samu rukuni ta ID
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Ba a samu rukunin ba'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Ƙirar rukuni
exports.createCategory = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Sabunta rukuni
exports.updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Ba a samu rukunin ba'
      });
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Share rukuni
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Ba a samu rukunin ba'
      });
    }

    // Duba ko akwai kayayyaki a cikin rukunin
    const Product = require('../models/Product');
    const productCount = await Product.countDocuments({ category: req.params.id });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Ba za a iya share rukunin ba saboda akwai kayayyaki ${productCount} a ciki`
      });
    }

    category.isActive = false;
    await category.save();

    res.status(200).json({
      success: true,
      message: 'An share rukunin cikin nasara'
    });
  } catch (error) {
    next(error);
  }
};
