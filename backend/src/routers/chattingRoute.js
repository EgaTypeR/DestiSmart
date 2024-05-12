const router = require('express').Router();
const {userMiddleware} = require('../middleware/userMiddleware');
const chattingController = require('../controllers/chattingController');

router.get('/get-conversation/:conversation_id', userMiddleware,chattingController.getConversation);
router.get('/list-conversations/:user_id', chattingController.getListOfConversations);
router.post('/send-message', chattingController.sendMessage);
router.post('/create-conversation/:user_id', chattingController.createNewConversation);

module.exports = router;