const {verify} = require('jsonwebtoken')

const userMiddleware = (req, res, next) => {
  try {
    const credentials = req.headers;
  if (!credentials.authorization) {
    return res.status(401).json({message: 'Unauthorized!'});
  }
  token = credentials.authorization.split(' ')[1];
  const decoded = verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);
  console.log(credentials.authorization);

  console.log('Middleware executed');
  next()
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  userMiddleware
};