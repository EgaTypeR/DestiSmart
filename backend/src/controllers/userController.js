const userModel = require('../models/userModels');


exports.getAllUsers = async(req, res, next) =>{
  
  try {
    var users = await userModel.find();
    return res.status(200).json({
      message: 'Get all users',
      data: users});
  } catch (error) {
    return res.status(500).json({message: 'Internal Server Error!' + error});
  } finally{
    next();
  }
}

exports.AddUser = async(req, res, next) =>{
  var user = req.body;
  if (!user) {
    return res.status(400).json({message: 'User data is required!'});
  }
  var userToAdd = new userModel(user);
  try {
    await userToAdd.save();
    return res.status(201).json({
      message: 'User added successfully!',
      data: userToAdd
    });
  } catch (error) {
    return res.status(500).json({message: 'Internal Server Error!' + error});
  } finally{
    next();
  }
}