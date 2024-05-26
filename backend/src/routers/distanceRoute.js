const router = require('express').Router();
const {userMiddleware} = require('../middleware/userMiddleware');
const distanceController = require('../controllers/distanceController');

router.get('/',userMiddleware,distanceController.distanceData);

module.exports = router;