const { pool } = require('../config/database');

class Job {
  static async create(jobData) {
    const { title, description, skills, budget, timeline, client_id } = jobData;
    
    const query = `
      INSERT INTO jobs (title, description, skills, budget, timeline, client_id) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    
    const result = await pool.query(query, [title, description, skills, budget, timeline, client_id]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT j.*, u.name as client_name, u.email as client_email,
             (SELECT COUNT(*) FROM proposals WHERE job_id = j.id) as proposal_count
      FROM jobs j 
      JOIN users u ON j.client_id = u.id 
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCount = 0;

    // Apply filters
    if (filters.status) {
      paramCount++;
      query += ` AND j.status = ${paramCount}`;
      queryParams.push(filters.status);
    }

    if (filters.search) {
      paramCount++;
      query += ` AND (j.title ILIKE ${paramCount} OR j.description ILIKE ${paramCount})`;
      queryParams.push(`%${filters.search}%`);
    }

    if (filters.skills) {
      paramCount++;
      const skillsArray = Array.isArray(filters.skills) ? filters.skills : filters.skills.split(',');
      query += ` AND j.skills && ${paramCount}`;
      queryParams.push(skillsArray);
    }

    if (filters.minBudget) {
      paramCount++;
      query += ` AND j.budget >= ${paramCount}`;
      queryParams.push(parseFloat(filters.minBudget));
    }

    if (filters.maxBudget) {
      paramCount++;
      query += ` AND j.budget <= ${paramCount}`;
      queryParams.push(parseFloat(filters.maxBudget));
    }

    if (filters.clientId) {
      paramCount++;
      query += ` AND j.client_id = ${paramCount}`;
      queryParams.push(filters.clientId);
    }

    // Default ordering
    query += ' ORDER BY j.created_at DESC';

    // Add limit if specified
    if (filters.limit) {
      paramCount++;
      query += ` LIMIT ${paramCount}`;
      queryParams.push(parseInt(filters.limit));
    }

    const result = await pool.query(query, queryParams);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT j.*, u.name as client_name, u.email as client_email,
             (SELECT COUNT(*) FROM proposals WHERE job_id = j.id) as proposal_count
      FROM jobs j 
      JOIN users u ON j.client_id = u.id 
      WHERE j.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByClientId(clientId) {
    const query = `
      SELECT j.*, 
             (SELECT COUNT(*) FROM proposals WHERE job_id = j.id) as proposal_count
      FROM jobs j 
      WHERE j.client_id = $1 
      ORDER BY j.created_at DESC
    `;
    
    const result = await pool.query(query, [clientId]);
    return result.rows;
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCounter = 1;

    Object.entries(updateData).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = $${paramCounter}`);
        values.push(value);
        paramCounter++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const query = `
      UPDATE jobs 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCounter} 
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM jobs WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE jobs 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async getJobStats(clientId) {
    const query = `
      SELECT 
        COUNT(*) as total_jobs,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_jobs,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_jobs,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_jobs,
        COALESCE(SUM(budget), 0) as total_budget,
        (SELECT COUNT(*) FROM proposals p JOIN jobs j ON p.job_id = j.id WHERE j.client_id = $1) as total_proposals
      FROM jobs 
      WHERE client_id = $1
    `;
    
    const result = await pool.query(query, [clientId]);
    return result.rows[0];
  }

  static async searchBySkills(skills, limit = 10) {
    const query = `
      SELECT j.*, u.name as client_name,
             (SELECT COUNT(*) FROM proposals WHERE job_id = j.id) as proposal_count
      FROM jobs j 
      JOIN users u ON j.client_id = u.id 
      WHERE j.skills && $1 AND j.status = 'open'
      ORDER BY j.created_at DESC 
      LIMIT $2
    `;
    
    const result = await pool.query(query, [skills, limit]);
    return result.rows;
  }

  static async getRecentJobs(limit = 5) {
    const query = `
      SELECT j.*, u.name as client_name,
             (SELECT COUNT(*) FROM proposals WHERE job_id = j.id) as proposal_count
      FROM jobs j 
      JOIN users u ON j.client_id = u.id 
      WHERE j.status = 'open'
      ORDER BY j.created_at DESC 
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

module.exports = Job;