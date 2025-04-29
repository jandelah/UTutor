// routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/auth');

// Protected routes
router.get('/', auth, sessionController.getSessions);
router.post('/', auth, sessionController.createSession);
router.get('/:id', auth, sessionController.getSessionById);
router.put('/:id', auth, sessionController.updateSession);
router.delete('/:id', auth, sessionController.deleteSession);

module.exports = router;