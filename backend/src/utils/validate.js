const {ObjectId} = require('mongodb');
const validator = require('validator');

function IsValidObjectId(id) {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

function IsValidEmail(email) {
  return validator.isEmail(email);
}

module.exports = {
  IsValidObjectId,
  IsValidEmail
}