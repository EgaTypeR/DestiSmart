const messageModel = require('../models/messageModel');
const userModel = require('../models/userModels');
const {getChatBotResponse, getTopic} = require('../utils/getChatbotResponse');
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
    sender = await userModel.findById(messageToAdd.senderID);
    if(!sender) {
      return res.status(400).json({message: 'Invalid sender ID!'});
    }
    conversation = await conversationModel.findById(messageToAdd.conversationID);
    if(!conversation) {
      return res.status(400).json({message: 'Invalid conversation ID!'});
    }
    try{
      const chatResponse = await getChatBotResponse(message.prompt);
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
    var messages = await messageModel.find({'conversationID' : conversationID}).sort({createdAt: -1});
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
  
  // Create a new conversation
  var topic = 'New Chat'
  var conversationToAdd = new conversationModel({
    'userID': userID,
    'name': topic,
    'lastMessage' : '',
    'lastMessageDate' : Date.now()
  });

  try {
    await conversationToAdd.save();
  } catch (error) {
    return res.status(500).json({message: 'Internal Server Error!' + error});
  }

  // Create a new message
  var message = req.body;
  if (!message) {
      return res.status(400).json({message: 'Message data is required!'});
  }
  var messageToAdd = new messageModel({
    'senderID': userID,
    'conversationID': conversationToAdd._id,
    'prompt': message.prompt
  });

  try{
    const chatResponse = await getChatBotResponse(message.prompt);
    const conversation = [
      {'role': 'user', 'content': message.prompt},
      {'role': 'assistant', 'content': chatResponse},
      {'role': 'user', 'content': 'What is the topic of this conversation?'}
    ]
    topic = await getTopic(conversation)
    messageToAdd.response = chatResponse;
    await messageToAdd.save();
  } catch (error) {
    return res.status(500).json({message: 'Internal Server Error!' + error});
  }

  conversationToAdd.name = topic;
  conversationToAdd.date = Date.now();
  try {
    await conversationToAdd.save();
    return res.status(201).json({
      message: 'Conversation added successfully!',
      data: {
        conversation : conversationToAdd,
        message: messageToAdd,
      }
    });
  } catch (error) {
    return res.status(500).json({message: 'Internal Server Error!' + error});
  } finally{
    next();
  }
}