const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // သင့်ရဲ့ User Model ဖိုင်လမ်းကြောင်းအတိုင်း စစ်ပါ

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Token ကို ဖြတ်ယူခြင်း
      token = req.headers.authorization.split(' ')[1];

      // Token မှန်ကန်မှု ရှိ/မရှိ စစ်ဆေးခြင်း
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      // 🌟 အဓိက အချက် - Database ထဲမှာ ဒီ User အမှန်တကယ် ရှိသေးလား စစ်ဆေးခြင်း
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'ဒီအကောင့်ကို Admin မှ ဖျက်လိုက်ပါပြီ သို့မဟုတ် မရှိတော့ပါ!' 
        });
      }

      // User အချက်အလက်များကို Request ထဲသို့ ထည့်ပေးခြင်း
      req.user = user;
      next();

    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token မမှန်ကန်ပါ သို့မဟုတ် သက်တမ်းကုန်သွားပါပြီ!' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token မပါရှိပါ။ Access Denied!' 
    });
  }
};

module.exports = protect;