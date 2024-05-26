const userModel = require('../models/userModels');
const bcrypt = require('bcrypt');
const {generateToken} = require('../utils/token');
const {IsValidEmail} = require('../utils/validate');

exports.login = async (req, res, next) => {
  try {
    const credentials = req.body;
    if (!credentials) {
      return res.status(400).json({ message: 'Credentials are required!' });
    }
    const { email, password } = credentials;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required!' });
    }

    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    // Generate JWT token
    const token = generateToken(user);

    const { password: userPassword, ...userResponse } = user._doc;

    return res.status(200).json({
      message: 'Login successful',
      user: userResponse,
      token: token
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.register = async(req, res, next) => {
  try {
    const credentials = req.body;
    if (!credentials) {
      return res.status(400).json({ message: 'Credentials are required!' });
    }
    const { email, password, firstname, lastname, gender} = credentials;
    if (!email || !password || !firstname || !lastname || !gender) {
      return res.status(400).json({ message: 'Fields are required!' });
    }
    if (!IsValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const user = await userModel.findOne({ email: email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstname,
      lastName: lastname,
      gender: gender,
    })

    const result = await newUser.save();

    return res.status(201).json({
      message: 'User created successfully, Go to login page to login.',
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

exports.logout = async(req, res, next) => {
  // client side aja
}