const express = require('express');
const { body } = require('express-validator');
const { createJob, getJobs, getJobById, getMyJobs, deleteJob, updateJob } = require('../controllers/jobController');
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

router.put('/:id', auth, [
  body('title').optional().notEmpty().trim(),
  body('description').optional().notEmpty().trim(),
  body('skills').optional().isArray({ min: 1 }),
  body('budget').optional().isNumeric({ min: 0 })
], updateJob);

router.delete('/:id', auth, deleteJob);

module.exports = router;