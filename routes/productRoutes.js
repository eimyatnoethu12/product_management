const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const rateLimit = require('express-rate-limit');

// 1. Rate Limiter 
const productCreateLimiter = rateLimit({
    windowMs: 1000, 
    max: 1, 
    message: { error: 'Too many products created from this account, please try again later.' },
    keyGenerator: (req) => req.user.id, // protect middleware က ထည့်ပေးလိုက်တဲ့ user ID ကို ယူသုံးခြင်း
});

// 🌟 Middleware 
const protect = require('../middleware/protect'); 

// 1. Product စာရင်းများကို ကြည့်ခြင်း (Login မလိုပါ - Public)
router.get('/', protect, getProducts);

// 2. Product အသစ်ထည့်ခြင်း (Login ဝင်ထားမှ / Token လိုအပ်သည်)
router.post('/', protect, productCreateLimiter, createProduct);

// 3. Product ပြင်ခြင်း (Login ဝင်ထားမှ / Token လိုအပ်သည်)
router.put('/:id', protect, updateProduct);

// 4. Product ဖျက်ခြင်း (Login ဝင်ထားမှ / Token လိုအပ်သည်)
router.delete('/:id', protect, deleteProduct);

module.exports = router;