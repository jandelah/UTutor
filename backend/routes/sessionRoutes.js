const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/auth');

// Protected routes
router.get('/', auth, sessionController.getSessions);
router.post('/', auth, sessionController.createSession);
router.get('/:id', auth, sessionController.getSessionById);

module.exports = router;