const messageModel = require('../models/messageModel');
const userModel = require('../models/userModels');
const {getChatBotResponse, getTopic, getTourismRecommendation, getCustomPrompt} = require('../utils/getChatbotResponse');
const conversationModel = require('../models/conversationModel');
const {IsValidObjectId} = require('../utils/validate');
const mongoose = require('mongoose');

exports.sendMessage = async (req, res, next) => {
  try {
    // Capture data from the request
    var message = req.body;
    const destination = req.body.destination;
    if (!message) {
      return res.status(400).json({message: 'Message data is required!'});
    }
    var messageToAdd = new messageModel(message);

    
    const [sender, conversation, lastPrompt] = await Promise.all([
      userModel.findById(messageToAdd.senderID),
      conversationModel.findById(messageToAdd.conversationID),
      messageModel.findOne({'conversationID' : messageToAdd.conversationID}).sort({createdAt: -1})
    ]);
    
    // Validate the sender ID
    if(!sender) {
      return res.status(400).json({message: 'Invalid sender ID!'});
    }
    // Validate the conversation ID
    if(!conversation) {
      return res.status(400).json({message: 'Invalid conversation ID!'});
    }

    var prompt = []
    // Construct Message from last 
    if (lastPrompt) {
      prompt = prompt.concat(
      {
        'role': 'user',
        'content': String(lastPrompt.prompt)
      },
      {
        'role': 'assistant',
        'content': String(lastPrompt.response)
      },
      )
    }
    prompt = prompt.concat(
      {
        'role': 'user',
        'content': `
          Disini kamu akan membahas tentang ${destination}, 
          jika dibawah ini membahas tentang lainnya abaikan atau bandingkan saja dengan prompt:
          ${messageToAdd.prompt}
          Jawab tetap berkaitan dengan tempat wisata ${destination}`
      }
    )
  
    try{
      const chatResponse = await getChatBotResponse(prompt);
      messageToAdd.response = chatResponse;
      await Promise.all([
        messageToAdd.save(),
        conversation.updateOne({'lastMessageDate' : Date.now()})
      ]) 
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
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  try{
    var conversations = await conversationModel.find({'userID' : userID}).limit(pageSize).skip(pageSize*(page-1)).sort({lastMessageDate: -1});
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
  try {
    const userID = req.params.user_id;
    const destination = req.body.destination;

    if (!userID) {
      return res.status(400).json({ message: 'No user ID provided!' });
    }
    if (!destination) {
      return res.status(400).json({ message: 'No destination provided!' });
    }

    // Create a new conversation
    const conversationToAdd = new conversationModel({
      userID: userID,
      name: destination,
      lastMessageDate: Date.now()
    });

    await conversationToAdd.save();

    // Create a new prompt
    const prompt = `Coba Jelaskan tentang ${destination}!`;
    const result = await getCustomPrompt(prompt);

    const messageToAdd = new messageModel({
      senderID: userID,
      conversationID: conversationToAdd._id,
      prompt: prompt,
      response: result
    });

    await messageToAdd.save();

    return res.status(201).json({ 
      conversation : conversationToAdd,
      message : messageToAdd
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error: ' + error.message });
  }
};

exports.getTourismRecommendation = async (req, res, next) => {
  try {
    // Capture data from the request
    const {senderID, location, budget, startDate, endDate} = req.body;
    if (!senderID) {
      return res.status(400).json({message: 'Sender ID is required!'});
    }
    // Validate the sender ID
    const sender = userModel.findById(senderID);
    if(!sender) {
      return res.status(400).json({message: 'Invalid sender ID!'});
    }
  
    // Get the chat response
    const chatResponse = await getTourismRecommendation(location, budget, startDate, endDate);

    return res.status(201).json({
      message: 'Success!',
      data: chatResponse,
    });
  } catch (error) {
    return res.status(500).json({message: 'Internal Server Error!' + error});
  } finally{
    next();
  }
}

exports.customPrompt = async (req, res, next) => {
  try {
    // Capture data from the request
    const {senderID, prompt} = req.body;
    if (!senderID) {
      return res.status(400).json({message: 'Sender ID is required!'});
    }
    // Validate the sender ID
    const sender = userModel.findById(senderID);
    if(!sender) {
      return res.status(400).json({message: 'Invalid sender ID!'});
    }
  
    // Get the chat response
    const chatResponse = await getCustomPrompt(prompt);
    return res.status(201).json({
      message: 'Success!',
      data: chatResponse,
    });
  } catch (error) {
    return res.status(500).json({message: 'Internal Server Error!' + error});
  } finally{
    next();
  }
}

exports.deleteConversation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userID, conversationID } = req.body;

    if (!userID || !conversationID) {
      return res.status(400).json({ message: 'User ID and Conversation ID are required!' });
    }

    await conversationModel.findOneAndDelete(
      { userID: userID, _id: conversationID },
      { session }
    );

    await messageModel.deleteMany(
      { senderID: userID, conversationID: conversationID },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: 'Conversation has been deleted!' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error deleting conversation:', error);
    return res.status(500).json({ message: 'Internal Server Error: ' + error.message });
  }
};
