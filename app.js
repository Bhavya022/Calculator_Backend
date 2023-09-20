const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const calculatorRoutes = require('./routes/api');
const cors = require('cors');
const app = express();
const mongoURI = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

// Use the environment variables in your code as needed

app.use(cors());
require('dotenv').config();

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
app.use('/', calculatorRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Customize error response based on error type
  if (err.name === 'ValidationError') {
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully.');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully.');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
