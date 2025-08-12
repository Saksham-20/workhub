const express = require('express');
const { body } = require('express-validator');
const { createJob, getJobs, getJobById, getMyJobs } = require('../controllers/jobController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', getJobs);
router.get('/my-jobs', auth, getMyJobs);
router.get('/:id', getJobById);

router.post('/', auth, [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('skills').isArray({ min: 1 }),
  body('budget').isNumeric({ min: 0 })
], createJob);

module.exports = router;