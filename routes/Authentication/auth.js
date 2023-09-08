const express = require('express');
const router = express.Router();
const UserInfo = require('../../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const JWT_Token = process.env.JWT_TOKEN;
router.use(express.json());

router.post('/signup',
  body('name', 'name should have a minimum length of 3').isLength({ min: 3 }),
  body('password', 'password should have a minimum length of 5').isLength({ min: 5 }),
  body('email').custom((value) => {
    // Check if the email ends with "@gndec.ac.in"
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(value) || !value.endsWith('@gmail.com')) {
      throw new Error('Invalid email format or email must end with @gmail.com');
    }
    return true; // Return true if validation passes
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Invalid Credentials", errors: errors.array() });
    }
    const validateUser = await UserInfo.findOne({ email: req.body.email });
    if (validateUser) {
      return res.status(400).json({ success: false, message: 'email' });
    }

    try {
      const myPlaintextPassword = req.body.password;
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(myPlaintextPassword, salt);
      const { name, email } = req.body;
      // Find the maximum jersey number assigned
      const UserDetail = await UserInfo.create({
        name: name,
        email: email,
        password: hash,
        isVerified: false,
      });
      await UserDetail.save();
      // Instead of returning just progressValue, return the entire UserDetail object
      return res.status(201).json({ success: true, UserDetail });
    } catch (error) {
      res.status(400).json({ success: false, message: error.keyValue });
    }
  }
);

router.post('/login', body('password', 'password should have a minimum length of 5').isLength({ min: 5 }), body('email').custom((value) => {
  // Check if the email ends with "@gndec.ac.in"
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(value) || !value.endsWith('@gmail.com')) {
    throw new Error('Invalid email format or email must end with @gmail.com');
  }
  return true; // Return true if validation passes
}), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: "Invalid Credentials", errors: errors.array() });
  }
  const { email, password } = req.body;
  const student = await UserInfo.findOne({ email });
  if (!student) {
    return res.status(400).json({ success: false, message: "User Not found" });
  }
  const passwordCompare = await bcrypt.compare(password, student.password);
  if (passwordCompare) {
    const data = {
      student: {
        id: student.id,
      }
    }
    if (student.isVerified === true) {
      const authToken = jwt.sign(data, JWT_Token);
      return res.status(200).json({ success: true, authtoken: authToken });
    }
    else {
      return res.status(200).json({ success: false, message: "Please verify your account" });
    }
  }
  return res.status(400).json({ success: false, message: "Please try to login with the correct credentials" });
});

module.exports = router;