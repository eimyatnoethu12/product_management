const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const rateLimit = require('express-rate-limit');

// 1. Rate Limiter (Window ကို ၁ မိနစ် သို့မဟုတ် သင့်တော်သလို တိုးမြှင့်ထားခြင်း)
const productCreateLimiter = rateLimit({
  windowMs: 60 * 1000, // ၁ မိနစ်
  max: 5, // ၁ မိနစ်အတွင်း ၅ ကြိမ်သာ ဖန်တီးခွင့်ပြုမည်
  message: { error: 'Too many products created from this account, please try again later.' },
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  }
});

// 🌟 Middleware 
const protect = require('../middleware/protect');
const { validateCreateProduct } = require('../middleware/productValidation');

// 1. Product စာရင်းများကို ကြည့်ခြင်း (Pagination ပါဝင်လာသည်)
router.get('/', getProducts);

// 2. Product အသစ်ထည့်ခြင်း
router.route('/').post(protect, productCreateLimiter, validateCreateProduct, createProduct);

// 3. Product ပြင်ခြင်း
router.put('/:id', protect, updateProduct);

// 4. Product ဖျက်ခြင်း
router.delete('/:id', protect, deleteProduct);

module.exports = router;