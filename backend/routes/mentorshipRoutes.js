// routes/mentorshipRoutes.js
const express = require('express');
const router = express.Router();
const mentorshipController = require('../controllers/mentorshipController');
const auth = require('../middleware/auth');

// Protected routes
router.get('/', auth, mentorshipController.getMentorships);
router.post('/', auth, mentorshipController.createMentorship);
router.get('/:id', auth, mentorshipController.getMentorshipById);
router.put('/:id', auth, mentorshipController.updateMentorship);
router.delete('/:id', auth, mentorshipController.deleteMentorship);

module.exports = router;