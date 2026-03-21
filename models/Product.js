const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sunan kayan yana da bukata'],
    trim: true,
    maxlength: [200, 'Sunan kayan ya yi tsawo']
  },
  description: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Rukuni yana da bukata']
  },
  price: {
    type: Number,
    required: [true, 'Farashin yana da bukata'],
    min: [0, 'Farashi ba zai iya kasancewa mara kyau ba']
  },
  costPrice: {
    type: Number,
    min: [0, 'Farashin saya ba zai iya kasancewa mara kyau ba'],
    default: 0
  },
  quantity: {
    type: Number,
    required: [true, 'Yawan yana da bukata'],
    min: [0, 'Yawan ba zai iya kasancewa mara kyau ba'],
    default: 0
  },
  minQuantity: {
    type: Number,
    default: 10,
    min: 0
  },
  unit: {
    type: String,
    default: 'piece',
    enum: ['piece', 'kg', 'liter', 'meter', 'box', 'carton', 'dozen']
  },
  supplier: {
    name: String,
    phone: String,
    email: String
  },
  images: [{
    url: String,
    alt: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index don bincike mai sauri
productSchema.index({ name: 'text', description: 'text', sku: 'text' });

// Hanyar duba ko yawan ya ƙasa
productSchema.methods.isLowStock = function() {
  return this.quantity <= this.minQuantity;
};

// Hanyar samun riba
productSchema.methods.getProfit = function() {
  return this.price - this.costPrice;
};

module.exports = mongoose.model('Product', productSchema);
    
