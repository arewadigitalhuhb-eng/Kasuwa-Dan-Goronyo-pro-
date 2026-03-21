const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sunan abokin ciniki yana da bukata'],
    trim: true,
    maxlength: [100, 'Sunan ya yi tsawo']
  },
  phone: {
    type: String,
    required: [true, 'Lambar waya tana da bukata'],
    trim: true,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Imel mai inganci']
  },
  address: {
    street: String,
    city: String,
    state: String
  },
  type: {
    type: String,
    enum: ['regular', 'wholesale', 'vip'],
    default: 'regular'
  },
  creditLimit: {
    type: Number,
    default: 0,
    min: 0
  },
  currentCredit: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPurchases: {
    type: Number,
    default: 0
  },
  lastPurchase: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [1000, 'Bayani ya yi tsawo']
  },
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

module.exports = mongoose.model('Customer', customerSchema);
    
