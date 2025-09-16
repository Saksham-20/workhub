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
      SELECT p.*, u.name as freelancer_name, u.email as freelancer_email,
             p.has_counter_bid, p.latest_counter_amount,
             (SELECT COUNT(*) FROM counter_bids WHERE proposal_id = p.id AND status = 'pending') as pending_counter_bids
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

const updateProposalStatus = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "accepted" or "rejected"' });
    }

    // Get proposal and verify ownership
    const proposalResult = await pool.query(`
      SELECT p.*, j.client_id 
      FROM proposals p 
      JOIN jobs j ON p.job_id = j.id 
      WHERE p.id = $1
    `, [proposalId]);

    if (proposalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const proposal = proposalResult.rows[0];

    // Check if user is the client who posted the job
    if (proposal.client_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if proposal is still pending
    if (!['pending', 'countered'].includes(proposal.status)) {
      return res.status(400).json({ error: 'Proposal has already been processed' });
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      if (status === 'accepted') {
        // Accept this proposal
        await client.query(
          'UPDATE proposals SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          ['accepted', proposalId]
        );

        // Reject all other proposals for the same job
        await client.query(
          'UPDATE proposals SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE job_id = $2 AND id != $3',
          ['rejected', proposal.job_id, proposalId]
        );

        // Update job status to in_progress
        await client.query(
          'UPDATE jobs SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          ['in_progress', proposal.job_id]
        );

        // Mark any pending counter bids as closed
        await client.query(
          'UPDATE counter_bids SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE proposal_id = $2 AND status = $3',
          ['closed', proposalId, 'pending']
        );
      } else {
        // Just reject this proposal
        await client.query(
          'UPDATE proposals SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          ['rejected', proposalId]
        );

        // Mark any pending counter bids as closed
        await client.query(
          'UPDATE counter_bids SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE proposal_id = $2 AND status = $3',
          ['closed', proposalId, 'pending']
        );
      }

      await client.query('COMMIT');

      // Get updated proposal
      const updatedResult = await pool.query(`
        SELECT p.*, u.name as freelancer_name, u.email as freelancer_email
        FROM proposals p 
        JOIN users u ON p.freelancer_id = u.id 
        WHERE p.id = $1
      `, [proposalId]);

      res.json({
        message: `Proposal ${status} successfully`,
        proposal: updatedResult.rows[0]
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserProposals = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ error: 'Only freelancers can view their proposals' });
    }

    const result = await pool.query(`
      SELECT p.*, j.title as job_title, j.description as job_description, 
             j.budget as job_budget, j.status as job_status,
             u.name as client_name, u.email as client_email,
             0 as pending_counter_bids
      FROM proposals p 
      JOIN jobs j ON p.job_id = j.id 
      JOIN users u ON j.client_id = u.id 
      WHERE p.freelancer_id = $1 
      ORDER BY p.created_at DESC
    `, [freelancerId]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { 
  createProposal, 
  getJobProposals, 
  updateProposalStatus,
  getUserProposals
};