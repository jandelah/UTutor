const express = require('express');
const router = express.Router();
const mentorshipController = require('../controllers/mentorshipController');
const auth = require('../middleware/auth');

// Protected routes
router.get('/', auth, mentorshipController.getMentorships);
router.post('/', auth, mentorshipController.createMentorship);
router.get('/:id', auth, mentorshipController.getMentorshipById);

module.exports = router;