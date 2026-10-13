const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const rateLimit = require('express-rate-limit');

// 1. Rate Limiter ကို သတ်မှတ်ပါ
const productCreateLimiter = rateLimit({
    windowMs: 60 * 1000, // ၁ မိနစ်အတွင်း
    max: 10, // Product ၅ ခုသာ တင်ခွင့်ပြုမည်
    message: { error: 'Too many products created from this account, please try again later.' },
    keyGenerator: (req) => req.user.id, // protect middleware က ထည့်ပေးလိုက်တဲ့ user ID ကို ယူသုံးခြင်း
});

// 🌟 Middleware ကို Import လုပ်ပါ (လမ်းကြောင်းမှန် မမှန် သေချာစစ်ပါ)
const protect = require('../middleware/protect'); 

// 1. Product စာရင်းများကို ကြည့်ခြင်း (Login မလိုပါ - Public)
router.get('/', getProducts);

// 2. Product အသစ်ထည့်ခြင်း (Login ဝင်ထားမှ / Token လိုအပ်သည်)
router.post('/', protect, productCreateLimiter, createProduct);

// 3. Product ပြင်ခြင်း (Login ဝင်ထားမှ / Token လိုအပ်သည်)
router.put('/:id', protect, updateProduct);

// 4. Product ဖျက်ခြင်း (Login ဝင်ထားမှ / Token လိုအပ်သည်)
router.delete('/:id', protect, deleteProduct);

module.exports = router;