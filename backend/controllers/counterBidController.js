const { validationResult } = require('express-validator');
const { pool } = require('../config/database');

// Create a counter bid
const createCounterBid = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { proposalId, counterAmount, message } = req.body;
    const fromUserId = req.user.id;

    // Get proposal details and verify permissions
    const proposalResult = await pool.query(`
      SELECT p.*, j.client_id, j.title, u.id as freelancer_id, u.name as freelancer_name 
      FROM proposals p 
      JOIN jobs j ON p.job_id = j.id 
      JOIN users u ON p.freelancer_id = u.id
      WHERE p.id = $1
    `, [proposalId]);

    if (proposalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const proposal = proposalResult.rows[0];

    // Verify user permissions (only client can send counter bids for now)
    if (req.user.role !== 'client' || proposal.client_id !== fromUserId) {
      return res.status(403).json({ error: 'Only the job client can send counter offers' });
    }

    // Check if proposal is still pending
    if (proposal.status !== 'pending') {
      return res.status(400).json({ error: 'Can only counter pending proposals' });
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Create the counter bid
      const counterBidResult = await client.query(`
        INSERT INTO counter_bids (proposal_id, from_user_id, to_user_id, counter_amount, message) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *
      `, [proposalId, fromUserId, proposal.freelancer_id, counterAmount, message]);

      // Update proposal status and counter bid info
      await client.query(`
        UPDATE proposals 
        SET status = 'countered', 
            has_counter_bid = TRUE, 
            latest_counter_amount = $1,
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2
      `, [counterAmount, proposalId]);

      // Mark any previous counter bids for this proposal as superseded
      await client.query(`
        UPDATE counter_bids 
        SET status = 'superseded', updated_at = CURRENT_TIMESTAMP 
        WHERE proposal_id = $1 AND id != $2
      `, [proposalId, counterBidResult.rows[0].id]);

      await client.query('COMMIT');

      res.status(201).json({
        message: 'Counter offer sent successfully',
        counterBid: counterBidResult.rows[0]
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

// Get counter bids for a proposal
const getProposalCounterBids = async (req, res) => {
  try {
    const { proposalId } = req.params;

    // Verify user has access to this proposal
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

    // Check if user is either the client or the freelancer
    if (proposal.client_id !== req.user.id && proposal.freelancer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(`
      SELECT cb.*, 
             fu.name as from_user_name, fu.email as from_user_email,
             tu.name as to_user_name, tu.email as to_user_email
      FROM counter_bids cb
      JOIN users fu ON cb.from_user_id = fu.id
      JOIN users tu ON cb.to_user_id = tu.id
      WHERE cb.proposal_id = $1
      ORDER BY cb.created_at DESC
    `, [proposalId]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Respond to a counter bid (accept/reject/counter)
const respondToCounterBid = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { counterBidId } = req.params;
    const { action, newCounterAmount, message } = req.body; // action: 'accept', 'reject', 'counter'

    // Get counter bid details
    const counterBidResult = await pool.query(`
      SELECT cb.*, p.job_id, p.freelancer_id, p.bid_amount, j.client_id
      FROM counter_bids cb
      JOIN proposals p ON cb.proposal_id = p.id
      JOIN jobs j ON p.job_id = j.id
      WHERE cb.id = $1
    `, [counterBidId]);

    if (counterBidResult.rows.length === 0) {
      return res.status(404).json({ error: 'Counter bid not found' });
    }

    const counterBid = counterBidResult.rows[0];

    // Verify user is the recipient of the counter bid
    if (counterBid.to_user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only respond to counter bids sent to you' });
    }

    // Check if counter bid is still pending
    if (counterBid.status !== 'pending') {
      return res.status(400).json({ error: 'Counter bid has already been responded to' });
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      if (action === 'accept') {
        // Accept the counter bid - this finalizes the deal
        await client.query(`
          UPDATE counter_bids 
          SET status = 'accepted', updated_at = CURRENT_TIMESTAMP 
          WHERE id = $1
        `, [counterBidId]);

        // Update proposal to accepted with the counter amount
        await client.query(`
          UPDATE proposals 
          SET status = 'accepted', 
              bid_amount = $1,
              updated_at = CURRENT_TIMESTAMP 
          WHERE id = $2
        `, [counterBid.counter_amount, counterBid.proposal_id]);

        // Reject all other proposals for the same job
        await client.query(`
          UPDATE proposals 
          SET status = 'rejected', updated_at = CURRENT_TIMESTAMP 
          WHERE job_id = $1 AND id != $2
        `, [counterBid.job_id, counterBid.proposal_id]);

        // Update job status
        await client.query(`
          UPDATE jobs 
          SET status = 'in_progress', updated_at = CURRENT_TIMESTAMP 
          WHERE id = $1
        `, [counterBid.job_id]);

      } else if (action === 'reject') {
        // Reject the counter bid
        await client.query(`
          UPDATE counter_bids 
          SET status = 'rejected', updated_at = CURRENT_TIMESTAMP 
          WHERE id = $1
        `, [counterBidId]);

        // Reset proposal to pending
        await client.query(`
          UPDATE proposals 
          SET status = 'pending', 
              has_counter_bid = FALSE, 
              latest_counter_amount = NULL,
              updated_at = CURRENT_TIMESTAMP 
          WHERE id = $1
        `, [counterBid.proposal_id]);

      } else if (action === 'counter') {
        // Send a counter to the counter bid
        if (!newCounterAmount) {
          throw new Error('Counter amount is required for counter action');
        }

        // Mark current counter bid as countered
        await client.query(`
          UPDATE counter_bids 
          SET status = 'countered', updated_at = CURRENT_TIMESTAMP 
          WHERE id = $1
        `, [counterBidId]);

        // Create new counter bid in the opposite direction
        await client.query(`
          INSERT INTO counter_bids (proposal_id, from_user_id, to_user_id, counter_amount, message) 
          VALUES ($1, $2, $3, $4, $5)
        `, [counterBid.proposal_id, req.user.id, counterBid.from_user_id, newCounterAmount, message]);

        // Update proposal with new counter amount
        await client.query(`
          UPDATE proposals 
          SET latest_counter_amount = $1, updated_at = CURRENT_TIMESTAMP 
          WHERE id = $2
        `, [newCounterAmount, counterBid.proposal_id]);
      }

      await client.query('COMMIT');

      res.json({
        message: `Counter bid ${action}ed successfully`,
        action: action
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

// Get counter bids for current user (both sent and received)
const getUserCounterBids = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT cb.*, 
             p.id as proposal_id,
             j.title as job_title,
             j.budget as job_budget,
             fu.name as from_user_name, fu.email as from_user_email, fu.role as from_user_role,
             tu.name as to_user_name, tu.email as to_user_email, tu.role as to_user_role,
             CASE 
               WHEN cb.from_user_id = $1 THEN 'sent'
               ELSE 'received'
             END as direction,
             CASE 
               WHEN cb.expires_at < CURRENT_TIMESTAMP THEN TRUE
               ELSE FALSE
             END as is_expired
      FROM counter_bids cb
      JOIN proposals p ON cb.proposal_id = p.id
      JOIN jobs j ON p.job_id = j.id
      JOIN users fu ON cb.from_user_id = fu.id
      JOIN users tu ON cb.to_user_id = tu.id
      WHERE cb.from_user_id = $1 OR cb.to_user_id = $1
      ORDER BY cb.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createCounterBid,
  getProposalCounterBids,
  respondToCounterBid,
  getUserCounterBids
};