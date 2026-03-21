const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sunana yana da bukata'],
    trim: true,
    maxlength: [100, 'Sunan bai kamata ya wuce haruffa 100 ba']
  },
  email: {
    type: String,
    required: [true, 'Imel yana da bukata'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Da fatan za a shigar da imel mai inganci']
  },
  password: {
    type: String,
    required: [true, 'Kalmar sirri tana da bukata'],
    minlength: [6, 'Kalmar sirri taƙaita haruffa 6'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'seller', 'cashier'],
    default: 'seller'
  },
  phone: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password kafin adana
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hanyar daidaita kalmar sirri
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
