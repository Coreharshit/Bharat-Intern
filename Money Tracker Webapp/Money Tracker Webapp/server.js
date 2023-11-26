// server.js

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/money-tracker-webapp', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a mongoose schema for transactions
const transactionSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  type: String, // 'income' or 'expense'
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Middleware for parsing JSON and handling forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Routes

// Home route
app.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const balance = calculateBalance(transactions);
    res.render('index', { transactions, balance });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Add transaction route
app.post('/addTransaction', async (req, res) => {
  try {
    const { description, amount, type } = req.body;
    await Transaction.create({ description, amount, type });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Helper function to calculate balance
function calculateBalance(transactions) {
  return transactions.reduce((balance, transaction) => {
    return transaction.type === 'income'
      ? balance + transaction.amount
      : balance - transaction.amount;
  }, 0);
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
