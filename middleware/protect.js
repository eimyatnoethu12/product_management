const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Header ထဲက Token ကို ဖြတ်ယူခြင်း
      token = req.headers.authorization.split(' ')[1];

      // 2. Token မှန်ကန်မှု ရှိ/မရှိ စစ်ဆေးခြင်း
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      // 3. 🌟 အဓိက အချက် - Admin က အကောင့်ဖျက်လိုက်ရင် 
      // Database ထဲမှာ ဒီ User ID နဲ့ ရှာမတွေ့တော့တာကို ဒီနေရာကနေ စစ်ပါတယ်!
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'ဒီအကောင့်ကို Admin က ဖျက်လိုက်ပါပြီ သို့မဟုတ် မရှိတော့ပါ!' 
        });
      }

      // 4. User အချက်အလက်များကို Request ထဲသို့ ထည့်ပေးခြင်း
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