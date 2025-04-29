const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const auth = require('../middleware/auth');

// Protected routes
router.get('/', auth, resourceController.getResources);
router.post('/', auth, resourceController.createResource);
router.get('/:id', auth, resourceController.getResourceById);

module.exports = router;