const mongoose = require('mongoose');

const calculatorSchema = new mongoose.Schema({
  operation: { 
    type: String, 
    required: true,
    validate: {
      validator: function(value) {
        // You can customize this validation to allow only specific operations
        const validOperations = ['+', '-', '*', '/', '%'];
        return validOperations.includes(value);
      },
      message: props => `${props.value} is not a valid operation!`
    }
  },
  operand1: { type: Number, required: true },
  operand2: { type: Number, required: true },
  result: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Calculator = mongoose.model('Calculator', calculatorSchema);

module.exports = Calculator;
