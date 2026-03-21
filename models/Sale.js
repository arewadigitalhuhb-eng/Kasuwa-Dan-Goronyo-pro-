const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {  // Farashin lokacin sayarwa
    type: Number,
    required: true
  },
  costPrice: {  // Don ƙididdige riba
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true
  }
}, { _id: true });

const saleSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null  // Na musamman don abokan da ba a rajista ba
  },
  customerName: {  // Don abokan da ba a rajista ba
    type: String,
    trim: true
  },
  items: [saleItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'transfer', 'credit', 'mixed'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'partial', 'pending', 'credit'],
    default: 'paid'
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  change: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  },
  soldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  soldAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ƙirar lambar invoice kafin adana
saleSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const prefix = 'INV';
    const timestamp = date.getTime().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.invoiceNumber = `${prefix}-${timestamp}-${random}`;
  }
  next();
});

// Hanyar samun riba
saleSchema.methods.getProfit = function() {
  return this.items.reduce((total, item) => {
    const profitPerItem = (item.price - item.costPrice) * item.quantity;
    return total + profitPerItem;
  }, 0);
};

module.exports = mongoose.model('Sale', saleSchema);
