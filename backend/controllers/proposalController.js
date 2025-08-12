const { validationResult } = require('express-validator');
const { pool } = require('../config/database');

const createProposal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jobId, coverLetter, bidAmount } = req.body;
    const freelancerId = req.user.id;

    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ error: 'Only freelancers can submit proposals' });
    }

    // Check if job exists and is open
    const jobResult = await pool.query(
      'SELECT * FROM jobs WHERE id = $1 AND status = $2',
      [jobId, 'open']
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found or not open' });
    }

    // Check if freelancer already submitted a proposal
    const existingProposal = await pool.query(
      'SELECT * FROM proposals WHERE job_id = $1 AND freelancer_id = $2',
      [jobId, freelancerId]
    );

    if (existingProposal.rows.length > 0) {
      return res.status(400).json({ error: 'You have already submitted a proposal for this job' });
    }

    const result = await pool.query(
      'INSERT INTO proposals (job_id, freelancer_id, cover_letter, bid_amount) VALUES ($1, $2, $3, $4) RETURNING *',
      [jobId, freelancerId, coverLetter, bidAmount]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getJobProposals = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if user is the client who posted the job
    const jobResult = await pool.query(
      'SELECT * FROM jobs WHERE id = $1 AND client_id = $2',
      [jobId, req.user.id]
    );

    if (jobResult.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(`
      SELECT p.*, u.name as freelancer_name, u.email as freelancer_email
      FROM proposals p 
      JOIN users u ON p.freelancer_id = u.id 
      WHERE p.job_id = $1 
      ORDER BY p.created_at DESC
    `, [jobId]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createProposal, getJobProposals };