const express = require('express');
const Router = express.Router;
const Calculator = require('../models/calculator'); // Import the Calculator model
const { check, validationResult } = require('express-validator'); // Import the Express Validator middleware

const router = Router();

// Define a common error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

// API endpoint to perform calculations
router.post('/calculate', async (req, res, next) => { // Define 'next' as a parameter
  const { operation, operand1, operand2 } = req.body;

  // Validate the input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let result;
    switch (operation) {
      case 'add':
        result = operand1 + operand2;
        break;
      case 'subtract':
        result = operand1 - operand2;
        break;
      case 'multiply':
        result = operand1 * operand2;
        break;
      case 'divide':
        if (operand2 === 0) {
          throw new Error('Division by zero is not allowed');
        }
        result = operand1 / operand2;
        break;
      case 'percentage':
        result = (operand1 * operand2) / 100;
        break;
      default:
        throw new Error('Invalid operation');
    }

    const calculation = new Calculator({
      operation,
      operand1,
      operand2,
      result,
    });
    await calculation.save();

    res.status(201).json({ result });
  } catch (error) {
    next(error); // Use the error handler middleware for consistency
  }
});

// API endpoint to save a calculation
router.post('/save-calculation', async (req, res, next) => { // Define 'next' as a parameter
  const { operation, operand1, operand2, result } = req.body;

  // Validate the input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Create a new Calculator instance
    const newCalculation = new Calculator({
      operation,
      operand1,
      operand2,
      result,
    });

    // Save the calculation to the database
    await newCalculation.save();

    // Respond with the saved calculation
    res.status(201).json(newCalculation);
  } catch (error) {
    // Use the next() function to pass the error to the error handler middleware
    next(error);
  }
});

// Define validation rules using Express Validator middleware
const calculationValidationRules = [
  check('operation').isIn(['add', 'subtract', 'multiply', 'divide', 'percentage']),
  check('operand1').isNumeric(),
  check('operand2').isNumeric(),
  check('result').isNumeric(),
];

// Add the Express Validator middleware for the specified routes
router.post('/calculate', calculationValidationRules);
router.post('/save-calculation', calculationValidationRules);

// Add the error handler middleware
router.use(errorHandler);

module.exports = router;
