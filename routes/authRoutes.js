const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/authValidation');
// router.post('/register', register);
// router.post('/login', login);
// Register Route တွင် validation ထည့်ခြင်း
router.post('/register', validateRegister, register);

// Login Route တွင် validation ထည့်ခြင်း
router.post('/login', validateLogin, login);
module.exports = router;