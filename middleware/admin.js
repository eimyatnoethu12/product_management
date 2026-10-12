const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Admin ဝင်ခွင့်သာ ရှိသည် (Access Denied)' });
  }
};

module.exports = admin;