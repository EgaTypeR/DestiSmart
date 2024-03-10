const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.post('/add-user', userController.AddUser);


module.exports = router;