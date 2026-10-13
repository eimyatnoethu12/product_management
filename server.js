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

const limiter = rateLimit({
    windowMs: 1000, // ၁ မိနစ်အတွင်း
    max: 1, // User တစ်ဦးလျှင် Product ၅ ခုသာ အသစ်တင်ခွင့်ပြုမည်// IP တစ်ခုတည်းက Request အကြိမ် ၁၀၀ ထက်ပိုမခေါ်ရ
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
    // IP အစား User ရဲ့ ID ကို ယူပြီး ကန့်သတ်ရန် (req.user သည် authenticate လုပ်ပြီးသား middleware မှ ရလာမည်)
    keyGenerator: (req, res) => {
        return req.user.id; // User ID ကို unique key အဖြစ် သုံးခြင်း
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middlewares
app.use(cors());
app.use(express.json());

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
app.use('/api/', limiter);
// Global Error Handler Middleware
app.use(errorHandler);


// Root URL ဝင်လာရင် index.html ကို ပြရန်
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});