const jwt = require('jsonwebtoken');

function generateToken(user) {
  // Define the payload for the JWT token
  const payload = {
    userId: user._id,
    email: user.email,
  };

  const secretKey = process.env.JWT_SECRET_KEY; 
  // Generate the JWT token with the payload, a secret key, and options (if needed)
  const token = jwt.sign(payload, secretKey, {
    expiresIn: '1h' 
  });

  return token;
}

module.exports = {
  generateToken
}
