const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');

// 🌟 Middleware ကို Import လုပ်ပါ (လမ်းကြောင်းမှန် မမှန် သေချာစစ်ပါ)
const protect = require('../middleware/protect'); 

// 1. Product စာရင်းများကို ကြည့်ခြင်း (Login မလိုပါ - Public)
router.get('/', getProducts);

// 2. Product အသစ်ထည့်ခြင်း (Login ဝင်ထားမှ / Token လိုအပ်သည်)
router.post('/', protect, createProduct);

// 3. Product ပြင်ခြင်း (Login ဝင်ထားမှ / Token လိုအပ်သည်)
router.put('/:id', protect, updateProduct);

// 4. Product ဖျက်ခြင်း (Login ဝင်ထားမှ / Token လိုအပ်သည်)
router.delete('/:id', protect, deleteProduct);

module.exports = router;