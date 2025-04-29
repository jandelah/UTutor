// routes/resourceRoutes.js
const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const auth = require('../middleware/auth');

// Protected routes
router.get('/', auth, resourceController.getResources);
router.post('/', auth, resourceController.createResource);
router.get('/:id', auth, resourceController.getResourceById);
router.put('/:id', auth, resourceController.updateResource);
router.delete('/:id', auth, resourceController.deleteResource);
router.post('/:id/rate', auth, resourceController.rateResource);

module.exports = router;