const {verify} = require('jsonwebtoken')

const userMiddleware = (req, res, next) => {
  const credentials = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  if (!credentials) {
    return res.status(401).json({message: 'Unauthorized!'});
  }
  try {
  const secret = process.env.JWT_SECRET_KEY;
  const decoded = verify(credentials, secret);
  console.log(decoded);
  console.log(credentials.authorization);
  req.user = decoded;

  next()
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ message: 'Invalid token.'});
  }
}

module.exports = {
  userMiddleware
};