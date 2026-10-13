const { body, validationResult } = require('express-validator');

// 1. Register လုပ်စဉ် စစ်ဆေးခြင်း
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('အမည် ထည့်ရန် လိုအပ်ပါသည်။')
    .escape(), // 🌟 XSS ကာကွယ်ရန် HTML tags များကို escape လုပ်သည်
  
  body('email')
    .isEmail().withMessage('တရားဝင် Email ပုံစံ ဖြစ်ရပါမည်။')
    .normalizeEmail(), // Email ကို သန့်စင်ပေးသည်
  
  body('password')
    .isLength({ min: 6 }).withMessage('စကားဝှက်သည် အနည်းဆုံး ခြောက်လုံး ရှိရပါမည်။'),

  // Error ရှိမရှိ စစ်ဆေးခြင်း
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// 2. Login ဝင်စဉ် စစ်ဆေးခြင်း
const validateLogin = [
  body('email')
    .isEmail().withMessage('တရားဝင် Email ပုံစံ ဖြစ်ရပါမည်။')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('စကားဝှက် ထည့်ရန် လိုအပ်ပါသည်။'),

  // Error ရှိမရှိ စစ်ဆေးခြင်း
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateRegister, validateLogin };