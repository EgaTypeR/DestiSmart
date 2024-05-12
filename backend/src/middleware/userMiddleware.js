

const userMiddleware = (req, res, next) => {
  const credentials = req.headers;
  console.log(credentials.authorization);
  console.log('Middleware executed');
  next()
}

module.exports = {
  userMiddleware
};