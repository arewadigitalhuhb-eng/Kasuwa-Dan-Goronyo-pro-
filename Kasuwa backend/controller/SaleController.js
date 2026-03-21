const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const { paginate, getDateRange } = require('../utils/helpers');

// Samu duk sayayya
exports.getSales = async (req, res, next) => {
  try {
    const { customer, startDate, endDate, paymentStatus, period } = req.query;
    
    let query = {};
    
    if (customer) query.customer = customer;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    // Tace ta kwanan wata
    if (period) {
      const range = getDateRange(period);
      query.soldAt = { $gte: range.start, $lte: range.end };
    } else if (startDate || endDate) {
      query.soldAt = {};
      if (startDate) query.soldAt.$gte = new Date(startDate);
      if (endDate) query.soldAt.$lte = new Date(endDate);
    }

    const result = await paginate(Sale, query, {
      page: req.query.page,
      limit: req.query.limit,
      sort: '-soldAt'
    });

    await Sale.populate(result.data, [
      { path: 'customer', select: 'name phone' },
      { path: 'soldBy', select: 'name' },
      { path: 'items.product', select: 'name' }
    ]);

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

// Samu sayayya ta ID
exports.getSale = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('soldBy', 'name')
      .populate('items.product', 'name sku');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Ba a samu sayayyar ba'
      });
    }

    res.status(200).json({
      success: true,
      data: sale
    });
  } catch (error) {
    next(error);
  }
};

// Ƙirar sabon sayayya
exports.createSale = async (req, res, next) => {
  const session = await Sale.startSession();
  session.startTransaction();

  try {
    const { customer, customerName, items, discount, tax, paymentMethod, amountPaid, notes } = req.body;

    // Duba kayayyaki da ƙididdige jimla
    let subtotal = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      
      if (!product) {
        throw new Error(`Kayan da ID ${item.productId} ba a samu ba`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(`${product.name} bai isa ba a rumbuna (Available: ${product.quantity})`);
      }

      const itemTotal = (item.price * item.quantity) - (item.discount || 0);
      subtotal += itemTotal;

      saleItems.push({
        product: product._id,
        quantity: item.quantity,
        price: item.price,
        costPrice: product.costPrice,
        discount: item.discount || 0,
        total: itemTotal
      });

      // Rage yawan a rumbuna
      product.quantity -= item.quantity;
      await product.save({ session });
    }

    const total = subtotal - (discount || 0) + (tax || 0);
    const change = (amountPaid || 0) - total;

    // Ƙirar sayayya
    const sale = await Sale.create([{
      customer: customer || null,
      customerName: customerName || null,
      items: saleItems,
      subtotal,
      discount: discount || 0,
      tax: tax || 0,
      total,
      paymentMethod,
      paymentStatus: total <= (amountPaid || 0) ? 'paid' : (amountPaid > 0 ? 'partial' : 'credit'),
      amountPaid: amountPaid || 0,
      change: change > 0 ? change : 0,
      notes,
      soldBy: req.user.id
    }], { session });

    // Sabunta bayanan abokin ciniki idan yana da asusu
    if (customer) {
      const customerDoc = await Customer.findById(customer).session(session);
      if (customerDoc) {
        customerDoc.totalPurchases += total;
        customerDoc.lastPurchase = new Date();
        
        if (paymentStatus === 'credit') {
          customerDoc.currentCredit += (total - (amountPaid || 0));
        }
        
        await customerDoc.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: sale[0]
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// Bayar da bashin sayayya
exports.makePayment = async (req, res, next) => {
  try {
    const { amount } = req.body;
    
    const sale = await Sale.findById(req.params.id);
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Ba a samu sayayyar ba'
      });
    }

    const remaining = sale.total - sale.amountPaid;
    
    if (amount > remaining) {
      return res.status(400).json({
        success: false,
        message: `Kudin ya wuce, bashi na ƙasa: ${remaining}`
      });
    }

    sale.amountPaid += amount;
    
    if (sale.amountPaid >= sale.total) {
      sale.paymentStatus = 'paid';
      sale.change = sale.amountPaid - sale.total;
    } else {
      sale.paymentStatus = 'partial';
    }

    await sale.save();

    res.status(200).json({
      success: true,
      message: 'An karɓa kudi cikin nasara',
      data: {
        paid: sale.amountPaid,
        remaining: sale.total - sale.amountPaid,
        status: sale.paymentStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

// Rahoton sayayya
exports.getSalesReport = async (req, res, next) => {
  try {
    const { period, startDate, endDate } = req.query;
    let dateRange;

    if (period) {
      dateRange = getDateRange(period);
    } else {
      dateRange = {
        start: new Date(startDate || new Date().setDate(new Date().getDate() - 30)),
        end: new Date(endDate || new Date())
      };
    }

    const stats = await Sale.aggregate([
      {
        $match: {
          soldAt: { $gte: dateRange.start, $lte: dateRange.end }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$total' },
          totalTransactions: { $sum: 1 },
          averageOrder: { $avg: '$total' },
          totalItems: { $sum: { $sum: '$items.quantity' } }
        }
      }
    ]);

    // Sayayya ta rukuni
    const salesByPayment = await Sale.aggregate([
      {
        $match: {
          soldAt: { $gte: dateRange.start, $lte: dateRange.end }
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      period: { start: dateRange.start, end: dateRange.end },
      summary: stats[0] || {
        totalSales: 0,
        totalTransactions: 0,
        averageOrder: 0,
        totalItems: 0
      },
      byPaymentMethod: salesByPayment
    });
  } catch (error) {
    next(error);
  }
};
