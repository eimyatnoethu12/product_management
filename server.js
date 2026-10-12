const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI;

// Database အရင်ချိတ်ဆက်ပြီးမှသာ Server ကို စတင်ရန်
mongoose.connect(dbURI, { family: 4 })
  .then(() => {
    console.log('MongoDB Cloud သို့ အောင်မြင်စွာ ချိတ်ဆက်ပြီးပါပြီ...');
    
    // DB ချိတ်ဆက်ပြီးမှ Server စတင်ပါ
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection Error:', err.message);
  });