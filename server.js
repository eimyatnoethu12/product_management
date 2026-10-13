const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Middlewares (Route တွေ မတိုင်ခင် အရင်ခံပေးရပါမယ်)
app.use(cors());
app.use(express.json());

// 🛡 Rate Limiter (Route တွေရဲ့ အပေါ်မှာ ထားပါ)
const limiter = rateLimit({
    windowMs: 1000, // ၁ စက္ကန့်
    max: 4, // တစ်စက္ကန့်လျှင် ၄ ကြိမ်သာ ခွင့်ပြုမည်
    message: { error: 'Too many requests, please try again later.' },
    keyGenerator: (req, res) => {
        // User Login ဝင်ထားရင် User ID သုံးမယ်၊ မဝင်ရသေးရင် IP ကို သုံးမယ် (Server Crash တာ ကာကွယ်ရန်)
        return req.user ? req.user.id : req.ip;
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// /api/ request အားလုံးကို Limiter နဲ့ စစ်မယ်
app.use('/api/', limiter);

// Database Connection
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB Cloud သို့ အောင်မြင်စွာ ချိတ်ဆက်ပြီးပါပြီ...'))
  .catch((err) => console.error('DB connection Error:', err.message));

app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Root URL ဝင်လာရင် index.html ကို ပြရန်
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Global Error Handler Middleware (အောက်ဆုံးမှာ ရှိရပါမယ်)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});