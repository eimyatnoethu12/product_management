const { body, validationResult } = require('express-validator');

const validateCreateProduct = [
  // 1. Name ကို စစ်ဆေးပြီး XSS မဖြစ်အောင် escape လုပ်ခြင်း
  body('name')
    .trim()
    .notEmpty().withMessage('Product အမည် ထည့်ရန် လိုအပ်ပါသည်။')
    .escape(), // 🌟 HTML tags များကို လုံခြုံသော Entities အဖြစ်သို့ ပြောင်းလဲပေးသည် (<script> များကို ဖြိုခွဲသည်)

  // 2. Price ကို နံပါတ်ဟုတ်မဟုတ် စစ်ဆေးခြင်း
  body('price')
    .isNumeric().withMessage('ဈေးနှုန်းသည် နံပါတ်သာ ဖြစ်ရပါမည်။')
    .escape(),

  // 3. Error ရှိမရှိ စစ်ဆေးပြီး ဖမ်းယူခြင်း
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    next();
  }
];

module.exports = validateCreateProduct;