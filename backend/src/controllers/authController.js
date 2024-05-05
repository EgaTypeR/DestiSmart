const {default: mongoose} = require('mongoose');
const userModel = require('../models/userModels');
const bcrypt = require('bcrypt');
const {generateToken} = require('../utils/token');

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

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = generateToken(user);
    return res.status(200).json({
      message: 'Login successful',
      user: user,
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
    const { email, password, firstname, lastname} = credentials;
    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({ message: 'Fields are required!' });
    }

    const user = await userModel.findOne({ email: email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      email: email,
      password: hashedPassword,
      firstName: firstname,
      lastName: lastname
    })

    const result = await newUser.save();

    return res.status(201).json({
      message: 'User created successfully',
      user: result
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

exports.logout = async(req, res, next) => {

}