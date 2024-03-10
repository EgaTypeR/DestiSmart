const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const responseSchema = new Schema({
  messageId: {
    type: String,
    required: true
  },
  botId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: false
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('response', responseSchema);