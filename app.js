const express = require('express');
const { Express } = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const calculatorRoutes =require('./routes/api');
const app= express();

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
app.use('/api', calculatorRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the Express server
const port= process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
