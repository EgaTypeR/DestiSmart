const mongoose = require('mongoose');

const Schema = mongoose.Schema
const conversationModel = new Schema ({
  userID: {
    type: String,
    required: true
  },
  name : {
    type: String,
    required: true
  },
},
{
  timestamps: true
});

module.exports = mongoose.model('conversation', conversationModel);