const router = require('express').Router();
const chattingController = require('../controllers/chattingController');

router.get('/get-conversations', chattingController.getConversation);
router.post('/send-message', chattingController.sendMessage);

module.exports = router;