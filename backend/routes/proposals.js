const express = require('express');
const { body } = require('express-validator');
const { createProposal, getJobProposals } = require('../controllers/proposalController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, [
  body('jobId').isNumeric(),
  body('coverLetter').notEmpty().trim(),
  body('bidAmount').isNumeric({ min: 0 })
], createProposal);

router.get('/job/:jobId', auth, getJobProposals);

module.exports = router;