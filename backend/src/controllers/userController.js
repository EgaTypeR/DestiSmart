
exports.getAllUsers = async(req, res, next) =>{
  return res.status(200).json({message: 'Get all users'});
}