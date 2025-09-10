const { pool } = require('../config/database');

class Proposal {
  static async create(proposalData) {
    const { job_id, freelancer_id, cover_letter, bid_amount } = proposalData;
    
    const query = `
      INSERT INTO proposals (job_id, freelancer_id, cover_letter, bid_amount) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    
    const result = await pool.query(query, [job_id, freelancer_id, cover_letter, bid_amount]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT p.*, 
             u.name as freelancer_name, u.email as freelancer_email,
             j.title as job_title, j.budget as job_budget
      FROM proposals p 
      JOIN users u ON p.freelancer_id = u.id 
      JOIN jobs j ON p.job_id = j.id
      WHERE p.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByJobId(jobId) {
    const query = `
      SELECT p.*, 
             u.name as freelancer_name, u.email as freelancer_email
      FROM proposals p 
      JOIN users u ON p.freelancer_id = u.id 
      WHERE p.job_id = $1 
      ORDER BY p.created_at DESC
    `;
    
    const result = await pool.query(query, [jobId]);
    return result.rows;
  }

  static async findByFreelancerId(freelancerId) {
    const query = `
      SELECT p.*, 
             j.title, j.description, j.budget, j.skills, j.status,
             u.name as client_name
      FROM proposals p 
      JOIN jobs j ON p.job_id = j.id 
      JOIN users u ON j.client_id = u.id
      WHERE p.freelancer_id = $1 
      ORDER BY p.created_at DESC
    `;
    
    const result = await pool.query(query, [freelancerId]);
    return result.rows;
  }

  static async findExisting(jobId, freelancerId) {
    const query = `
      SELECT * FROM proposals 
      WHERE job_id = $1 AND freelancer_id = $2
    `;
    
    const result = await pool.query(query, [jobId, freelancerId]);
    return result.rows[0];
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCounter = 1;

    Object.entries(updateData).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = ${paramCounter}`);
        values.push(value);
        paramCounter++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const query = `
      UPDATE proposals 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${paramCounter} 
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE proposals 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM proposals WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async acceptProposal(proposalId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get proposal details
      const proposalQuery = 'SELECT * FROM proposals WHERE id = $1';
      const proposalResult = await client.query(proposalQuery, [proposalId]);
      const proposal = proposalResult.rows[0];
      
      if (!proposal) {
        throw new Error('Proposal not found');
      }
      
      // Accept the proposal
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
      
      await client.query('COMMIT');
      
      return await this.findById(proposalId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getProposalStats(freelancerId) {
    const query = `
      SELECT 
        COUNT(*) as total_proposals,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_proposals,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_proposals,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_proposals,
        COALESCE(AVG(bid_amount), 0) as avg_bid_amount,
        COALESCE(SUM(CASE WHEN status = 'accepted' THEN bid_amount END), 0) as total_earnings
      FROM proposals 
      WHERE freelancer_id = $1
    `;
    
    const result = await pool.query(query, [freelancerId]);
    return result.rows[0];
  }

  static async getJobProposalStats(jobId) {
    const query = `
      SELECT 
        COUNT(*) as total_proposals,
        COALESCE(AVG(bid_amount), 0) as avg_bid,
        COALESCE(MIN(bid_amount), 0) as min_bid,
        COALESCE(MAX(bid_amount), 0) as max_bid
      FROM proposals 
      WHERE job_id = $1
    `;
    
    const result = await pool.query(query, [jobId]);
    return result.rows[0];
  }

  static async getRecentProposals(jobId, limit = 5) {
    const query = `
      SELECT p.*, u.name as freelancer_name
      FROM proposals p 
      JOIN users u ON p.freelancer_id = u.id 
      WHERE p.job_id = $1 
      ORDER BY p.created_at DESC 
      LIMIT $2
    `;
    
    const result = await pool.query(query, [jobId, limit]);
    return result.rows;
  }
}

module.exports = Proposal;