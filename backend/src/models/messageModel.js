const mongoose = require('mongoose');

const Schema = mongoose.Schema
const messageModel = new Schema ({
  conversationID: {
    type: String,
    required: true
  },
  senderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  response:{
    type: String,
    required: false
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('message', messageModel);