const mongoose = require('mongoose');

const Schema = mongoose.Schema
const messageModel = new Schema ({
  conversationID: {
    type: int,
    required: true
  },
  senderID: {
    type: int,
    required: true
  },
  message: {
    type: String,
    required: true
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('message', messageModel);