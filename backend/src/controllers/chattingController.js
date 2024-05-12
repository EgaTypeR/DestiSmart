const messageModel = require('../models/messageModel');
const getChatBotResponse = require('../utils/getChatbotResponse');
const responseModel = require('../models/responseModel');
const conversationModel = require('../models/conversationModel');
const {IsValidObjectId} = require('../utils/validate');

exports.sendMessage = async (req, res, next) => {
  try {
    var message = req.body;
    if (!message) {
      return res.status(400).json({message: 'Message data is required!'});
    }
    var messageToAdd = new messageModel(message);
    try{
      const chatResponse = getChatBotResponse(message.content);
      messageToAdd.response = chatResponse;
      await messageToAdd.save();
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error!' + error});
    }
    return res.status(201).json({
      message: 'Message added successfully!',
      data: messageToAdd,
    });
  } catch (error) {
    return res.status(500).json({message: 'Internal Server Error!' + error});
  } finally{
    next();
  }
}

exports.getConversation = async (req, res, next) => {
  const conversationID = req.params.conversation_id;
  if (!conversationID || !IsValidObjectId(conversationID)) {
    return res.status(400).json({message: 'Invalid ID!'});
  }
  try{
    var conversation = await conversationModel.findById(conversationID);
    if (!conversation) {
      return res.status(404).json({message: 'No conversation found!'});
    }
    var messages = await messageModel.find({'conversationID' : conversationID}).sort({createdAt: 1});
    return res.status(200).json({
      message: 'Success',
      data: {
        conversation : conversation,
        messages : messages
    }
    });
  }
  catch (error) {
    return res.status(500).json({message: 'Internal Server Error!' + error});
  } finally{
    next();
  }
};

exports.getListOfConversations = async (req, res, next) => {
  const userID = req.params.user_id;
  console.log(userID);
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  try{
    var conversations = await conversationModel.find({'userID' : userID}).limit(pageSize).skip(pageSize*(page-1)).sort({lastMessageDate: -1});
    console.log(conversations);
    if (!conversations) {
      return res.status(404).json({message: 'No conversation found!'});
    }
    return res.status(200).json({
      message: 'Success',
      data: conversations
    });
  }
  catch (error) {
    return res.status(500).json({message: 'Internal Server Error!' + error});
  } finally{
    next();
  }
}

exports.createNewConversation = async (req, res, next) => {
  const userID = req.params.user_id;
  if (!userID) {
    return res.status(400).json({message: 'No user ID provided!'});
  }
  var conversationToAdd = new conversationModel({
    'userID': userID,
    'name': '',
    'lastMessage' : '',
    'lastMessageDate' : Date.now()
  });
  try {
    await conversationToAdd.save();
    return res.status(201).json({
      message: 'Conversation added successfully!',
      data: conversationToAdd
    });
  } catch (error) {
    return res.status(500).json({message: 'Internal Server Error!' + error});
  } finally{
    next();
  }
}