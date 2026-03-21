const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sunan rukuni yana da bukata'],
    unique: true,
    trim: true,
    maxlength: [50, 'Sunan rukuni ya yi tsawo']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Bayani ya yi tsawo']
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  icon: {
    type: String,
    default: 'box'
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

module.exports = mongoose.model('Category', categorySchema);
