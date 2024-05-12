const {ObjectId} = require('mongodb');

function IsValidObjectId(id) {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

module.exports = {
  IsValidObjectId
}