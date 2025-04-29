const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/me', auth, userController.getProfile);
router.put('/me', auth, userController.updateProfile);
router.get('/', auth, ctrl.getUsers);


module.exports = router;