const express = require('express');
const Router = express.Router;
const Request = express.Request;
const Response = express.Response;

const Calculator = require('../models/calculator'); // Import the Calculator model

const router= Router();

// API endpoint to perform calculations
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
        result = operand1 / operand2;
        break;
      case 'percentage':
        result = (operand1 * operand2) / 100;
        break;
      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }

    // Create a new calculation record and save it to the database
    const calculation = new Calculator({
      operation,
      operand1,
      operand2,
      result,
    });
    await calculation.save();

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}); 
router.get('/',async(req,res)=>{
  res.send('welcome to calcee')
})

router.get('/history', async (req, res) => {
    try {
      // Fetch all calculation records from the database
      const calculations = await Calculator.find().sort({ createdAt: -1 });
      res.status(200).json({ calculations });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  // API endpoint to recalculate a specific calculation by ID
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
          result = calculation.operand1 / calculation.operand2;
          break;
        case 'percentage':
          result = (calculation.operand1 * calculation.operand2) / 100;
          break;
        default:
          return res.status(400).json({ error: 'Invalid operation' });
      }
  
      // Update the calculation with the new result
      calculation.result = result;
      await calculation.save();
  
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  // API endpoint to delete a specific calculation by ID
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
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  
  

module.exports=router;
