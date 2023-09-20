const mongoose = require('mongoose');

const calculatorSchema = new mongoose.Schema({
  operation: { type: String, required: true },
  operand1: { type: Number, required: true },
  operand2: { type: Number, required: true },
  result: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Calculator = mongoose.model('Calculator', calculatorSchema);

module.exports = Calculator;
