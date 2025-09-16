const { validationResult } = require('express-validator');
const { pool } = require('../config/database');
const Job = require('../models/Job');

const createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, skills, budget } = req.body;
    const clientId = req.user.id;

    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Only clients can post jobs' });
    }

    const result = await pool.query(
      'INSERT INTO jobs (title, description, skills, budget, client_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, skills, budget, clientId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getJobs = async (req, res) => {
  try {
    const { search, skills, minBudget, maxBudget } = req.query;
    let query = `
      SELECT j.*, u.name as client_name, u.email as client_email,
             (SELECT COUNT(*)::INTEGER FROM proposals WHERE job_id = j.id) as proposal_count
      FROM jobs j 
      JOIN users u ON j.client_id = u.id 
      WHERE j.status = 'open'
    `;
    const queryParams = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (j.title ILIKE $${paramCount} OR j.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    if (skills) {
      paramCount++;
      query += ` AND j.skills && $${paramCount}`;
      queryParams.push(skills.split(','));
    }

    if (minBudget) {
      paramCount++;
      query += ` AND j.budget >= $${paramCount}`;
      queryParams.push(parseFloat(minBudget));
    }

    if (maxBudget) {
      paramCount++;
      query += ` AND j.budget <= $${paramCount}`;
      queryParams.push(parseFloat(maxBudget));
    }

    query += ' ORDER BY j.created_at DESC';

    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT j.*, u.name as client_name, u.email as client_email,
             (SELECT COUNT(*) FROM proposals WHERE job_id = j.id) as proposal_count
      FROM jobs j 
      JOIN users u ON j.client_id = u.id 
      WHERE j.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (req.user.role === 'client') {
      const result = await pool.query(`
        SELECT j.*, 
               (SELECT COUNT(*) FROM proposals WHERE job_id = j.id) as proposal_count
        FROM jobs j 
        WHERE j.client_id = $1 
        ORDER BY j.created_at DESC
      `, [userId]);
      
      res.json(result.rows);
    } else {
      const result = await pool.query(`
        SELECT j.*, u.name as client_name, p.cover_letter, p.bid_amount, p.status as proposal_status
        FROM jobs j 
        JOIN proposals p ON j.id = p.job_id 
        JOIN users u ON j.client_id = u.id
        WHERE p.freelancer_id = $1 
        ORDER BY p.created_at DESC
      `, [userId]);
      
      res.json(result.rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // First check if the job exists and belongs to the user
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    if (job.client_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }
    
    // Delete the job
    await Job.delete(id);
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;
    
    // First check if the job exists and belongs to the user
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    if (job.client_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }
    
    // Update the job
    const updatedJob = await Job.update(id, updateData);
    
    res.json({ message: 'Job updated successfully', job: updatedJob });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createJob, getJobs, getJobById, getMyJobs, deleteJob, updateJob };