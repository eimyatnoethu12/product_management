const Product = require('../models/Product');

// 1. Product အားလုံးကို ထုတ်ယူခြင်း (Pagination ပါ ထည့်သွင်းထားသည်)
exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();

    res.json({
      success: true,
      count: products.length,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// 2. Product အသစ်ဖန်တီးခြင်း
exports.createProduct = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    const product = await Product.create({ name, price, user: req.user.id });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// 3. Product ပြင်ဆင်ခြင်း (Security & Null Check Fix)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product မတွေ့ရှိပါ' });
    }

    // 🔒 Null check for product.user to prevent server crash
    const productUserId = product.user ? product.user.toString() : null;
    if (productUserId && productUserId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'ဤ Product ကို ပြင်ဆင်ခွင့် မရှိပါ' });
    }

    // 🔒 Security Fix: Mass assignment ကာကွယ်ရန် user field ကို update လုပ်ခွင့်မပေးပါ
    const { user, ...updateData } = req.body;

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// 4. Product ဖျက်ခြင်း
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product မတွေ့ရှိပါ' });
    }

    const productUserId = product.user ? product.user.toString() : null;
    if (productUserId && productUserId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'ဤ Product ကို ဖျက်ဆီးခွင့် မရှိပါ' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product ဖျက်ပြီးပါပြီ' });
  } catch (error) {
    next(error);
  }
};