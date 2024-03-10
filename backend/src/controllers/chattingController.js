const messageModel = require('../models/messageModel');
const getChatBotResponse = require('../utils/getChatbotResponse');
const responseModel = require('../models/responseModel');

exports.sendMessage = async (req, res, next) => {
  try {
    var message = req.body;
    var responseToAdd = new responseModel();
    if (!message) {
      return res.status(400).json({message: 'Message data is required!'});
    }
    var messageToAdd = new messageModel(message);
    await messageToAdd.save();
    try{
      const chatResponse = getChatBotResponse(message.content);
      responseToAdd = responseModel({
        messageId: messageToAdd._id,
        botId: '1',
        content: chatResponse
      });
      await responseToAdd.save();
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error!' + error});
    }
    return res.status(201).json({
      message: 'Message added successfully!',
      data: messageToAdd,
      response: responseToAdd
    });
  } catch (error) {
    return res.status(500).json({message: 'Internal Server Error!' + error});
  } finally{
    next();
  }
}

exports.getConversation = async (req, res, next) => {
  return res.status(200).json({message: 'Get conversation'});
};