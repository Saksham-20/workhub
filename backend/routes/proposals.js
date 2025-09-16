const express = require('express');
const { body } = require('express-validator');
const { createProposal, getJobProposals, updateProposalStatus, getUserProposals } = require('../controllers/proposalController');
const { 
  createCounterBid, 
  getProposalCounterBids, 
  respondToCounterBid, 
  getUserCounterBids 
} = require('../controllers/counterBidController');
const auth = require('../middleware/auth');

const router = express.Router();

// Existing proposal routes
router.post('/', auth, [
  body('jobId').isNumeric(),
  body('coverLetter').notEmpty().trim(),
  body('bidAmount').isNumeric({ min: 0 })
], createProposal);

router.get('/user', auth, getUserProposals);
router.get('/job/:jobId', auth, getJobProposals);
router.put('/:proposalId', auth, [
  body('status').isIn(['accepted', 'rejected'])
], updateProposalStatus);

// New counter bid routes
router.post('/counter-bids', auth, [
  body('proposalId').isNumeric(),
  body('counterAmount').isNumeric({ min: 0 }),
  body('message').optional().trim()
], createCounterBid);

router.get('/counter-bids/user', auth, getUserCounterBids);
router.get('/:proposalId/counter-bids', auth, getProposalCounterBids);

router.put('/counter-bids/:counterBidId', auth, [
  body('action').isIn(['accept', 'reject', 'counter']),
  body('newCounterAmount').optional().isNumeric({ min: 0 }),
  body('message').optional().trim()
], respondToCounterBid);

module.exports = router;