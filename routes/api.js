const express = require('express');
const Router = express.Router;
const Calculator = require('../models/calculator'); // Import the Calculator model

const router = Router();

// Define a common error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

// API endpoint to perform calculations
router.get('/', async (req, res) => {
  res.send('Welcome to Calcee');
});

router.post('/calculate', async (req, res) => {
  const { operation, operand1, operand2 } = req.body;

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

router.get('/history', async (req, res) => {
  try {
    // Fetch all calculation records from the database
    const calculations = await Calculator.find().sort({ createdAt: -1 });
    res.status(200).json({ calculations });
  } catch (error) {
    next(error); // Use the error handler middleware for consistency
  }
});

router.get('/recalculate/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the calculation by ID
    const calculation = await Calculator.findById(id);

    if (!calculation) {
      return res.status(404).json({ error: 'Calculation not found' });
    }

    // Recalculate the result based on the stored operation, operand1, and operand2
    let result;
    switch (calculation.operation) {
      case 'add':
        result = calculation.operand1 + calculation.operand2;
        break;
      case 'subtract':
        result = calculation.operand1 - calculation.operand2;
        break;
      case 'multiply':
        result = calculation.operand1 * calculation.operand2;
        break;
      case 'divide':
        if (calculation.operand2 === 0) {
          throw new Error('Division by zero is not allowed');
        }
        result = calculation.operand1 / calculation.operand2;
        break;
      case 'percentage':
        result = (calculation.operand1 * calculation.operand2) / 100;
        break;
      default:
        throw new Error('Invalid operation');
    }

    // Update the calculation with the new result
    calculation.result = result;
    await calculation.save();

    res.status(200).json({ result });
  } catch (error) {
    next(error); // Use the error handler middleware for consistency
  }
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the calculation by ID and delete it
    const deletedCalculation = await Calculator.findByIdAndDelete(id);

    if (!deletedCalculation) {
      return res.status(404).json({ error: 'Calculation not found' });
    }

    res.status(200).json({ message: 'Calculation deleted successfully' });
  } catch (error) {
    next(error); // Use the error handler middleware for consistency
  }
});

router.post('/save-calculation', async (req, res) => {
  try {
    const { operation, operand1, operand2, result } = req.body;

    // Validate the input data (you can add more validation)
    if (!operation || !operand1 || !operand2 || !result) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    // Create a new Calculator instance
    const newCalculation = new Calculator({
      operation,
      operand1,
      operand2,
      result,
    });

    // Save the calculation to the database
    await newCalculation.save();

    // Respond with a success message or the saved calculation
    res.status(201).json(newCalculation);
  } catch (error) {
    next(error); // Use the error handler middleware for consistency
  }
});

// Add the error handler middleware
router.use(errorHandler);

module.exports = router;
