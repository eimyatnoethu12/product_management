const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json({ success: true, data: products });
  } catch (error) { next(error); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    const product = await Product.create({ name, price, user: req.user.id });
    res.status(201).json({ success: true, data: product });
  } catch (error) { next(error); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product မတွေ့ရှိပါ' });

    // 🔒 ဤ Product ၏ ပိုင်ရှင် (owner) ဟုတ်မဟုတ် စစ်ဆေးခြင်း (သို့မဟုတ် Admin ဟုတ်မစစ်)
    if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'ဤ Product ကို ပြင်ဆင်ခွင့် မရှိပါ' });
    }
    
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: product });
  } catch (error) { next(error); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product မတွေ့ရှိပါ' });
    
    // 🔒 ဤ Product ၏ ပိုင်ရှင် (owner) ဟုတ်မဟုတ် စစ်ဆေးခြင်း (သို့မဟုတ် Admin ဟုတ်မစစ်)
    if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'ဤ Product ကို ဖျက်ဆီးခွင့် မရှိပါ' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product ဖျက်ပြီးပါပြီ' });
  } catch (error) { next(error); }
};