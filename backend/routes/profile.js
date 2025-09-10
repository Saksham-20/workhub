const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get current user's profile
router.get('/me', ProfileController.getProfile);

// Update current user's profile
router.put('/me', ProfileController.updateProfile);

// Upload profile picture
router.post('/me/picture', ProfileController.uploadProfilePicture);

// Get profile statistics
router.get('/me/stats', ProfileController.getProfileStats);

// Get public profile of another user
router.get('/:userId', ProfileController.getPublicProfile);

// Search freelancers (public route, but requires auth for now)
router.get('/search/freelancers', ProfileController.searchFreelancers);

// Search clients (public route, but requires auth for now)
router.get('/search/clients', ProfileController.searchClients);

module.exports = router;
