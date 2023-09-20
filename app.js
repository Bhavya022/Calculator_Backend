const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const calculatorRoutes = require('./routes/api'); // Import the calculator route 
const app = express();
const cors = require('cors') 
app.use(cors())
// Connect to MongoDB (replace 'mongodb://localhost/calculator' with your MongoDB URL)
mongoose.connect('mongodb+srv://bhavya:bhavya@cluster0.kin5ecd.mongodb.net/calc?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/', calculatorRoutes); // Use the calculator route

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
