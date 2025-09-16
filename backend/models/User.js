const { pool } = require('../config/database');

const allowedProfileFields = [
  'name', 'profile_picture', 'bio', 'location', 'hourly_rate', 'skills',
  'languages', 'availability', 'experience_level', 'education',
  'certifications', 'verifications', 'portfolio', 'testimonials', 'employment_history',
  'other_experiences', 'licenses', 'company_name', 'company_description',
  'company_website', 'company_size', 'industry', 'title', 'profile_boost',
  'work_history', 'project_catalog', 'budget_range', 'project_duration',
  'timezone_preference', 'social_links'
];

class User {
  static async create(userData) {
    const { email, password, name, role } = userData;
    
    const query = `
      INSERT INTO users (email, password, name, role) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, email, name, role, created_at
    `;
    
    const result = await pool.query(query, [email, password, name, role]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
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
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCounter} 
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateProfile(id, profileData) {
    const allowedFields = allowedProfileFields;
    const jsonFields = new Set([
      'languages', 'education', 'certifications', 'verifications', 'portfolio', 'testimonials',
      'employment_history', 'other_experiences', 'licenses', 'work_history',
      'project_catalog', 'social_links'
    ]);

    const fields = [];
    const values = [];
    let paramCounter = 1;

    Object.entries(profileData).forEach(([key, value]) => {
      if (allowedFields.includes(key) && value !== undefined) {
        let normalizedValue = value;
        if (jsonFields.has(key)) {
          try {
            // If value is a string, try to parse; else stringify objects/arrays
            if (typeof value === 'string') {
              normalizedValue = JSON.parse(value);
            }
            normalizedValue = JSON.stringify(normalizedValue ?? null);
          } catch (_) {
            // Fallback to safe stringifying
            normalizedValue = JSON.stringify(value ?? null);
          }
        } else if (key === 'hourly_rate') {
          const num = Number(value);
          normalizedValue = Number.isFinite(num) ? num : null;
        } else if (key === 'profile_boost') {
          normalizedValue = Boolean(value);
        }

        fields.push(`${key} = $${paramCounter}`);
        values.push(normalizedValue);
        paramCounter++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid profile fields to update');
    }

    values.push(id);
    const query = `
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCounter} 
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getProfile(id) {
    const query = `
      SELECT 
        id, email, name, role, created_at, updated_at
      FROM users 
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async searchFreelancers(filters = {}) {
    let query = `
      SELECT 
        id, name, email, role, created_at
      FROM users 
      WHERE role = 'freelancer'
    `;
    
    const values = [];
    let paramCounter = 1;

    // Search by name or bio
    if (filters.search) {
      query += ` AND (name ILIKE $${paramCounter} OR bio ILIKE $${paramCounter + 1})`;
      values.push(`%${filters.search}%`);
      values.push(`%${filters.search}%`);
      paramCounter += 2;
    }

    // Search by skills
    if (filters.skills) {
      query += ` AND skills && $${paramCounter}`;
      values.push([filters.skills]);
      paramCounter++;
    }

    // Search by location
    if (filters.location) {
      query += ` AND location ILIKE $${paramCounter}`;
      values.push(`%${filters.location}%`);
      paramCounter++;
    }

    // Filter by minimum hourly rate
    if (filters.minRate) {
      query += ` AND hourly_rate >= $${paramCounter}`;
      values.push(parseFloat(filters.minRate));
      paramCounter++;
    }

    // Filter by maximum hourly rate
    if (filters.maxRate) {
      query += ` AND hourly_rate <= $${paramCounter}`;
      values.push(parseFloat(filters.maxRate));
      paramCounter++;
    }

    // Filter by experience level
    if (filters.experience_level) {
      query += ` AND experience_level = $${paramCounter}`;
      values.push(filters.experience_level);
      paramCounter++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async searchClients(filters = {}) {
    let query = `
      SELECT 
        id, name, profile_picture, bio, location, company_name,
        company_description, company_website, company_size, industry,
        created_at
      FROM users 
      WHERE role = 'client'
    `;
    
    const values = [];
    let paramCounter = 1;

    if (filters.industry) {
      query += ` AND industry = $${paramCounter}`;
      values.push(filters.industry);
      paramCounter++;
    }

    if (filters.location) {
      query += ` AND location ILIKE $${paramCounter}`;
      values.push(`%${filters.location}%`);
      paramCounter++;
    }

    if (filters.companySize) {
      query += ` AND company_size = $${paramCounter}`;
      values.push(filters.companySize);
      paramCounter++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async exists(email) {
    const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)';
    const result = await pool.query(query, [email]);
    return result.rows[0].exists;
  }

  static async getAllClients() {
    const query = `
      SELECT id, email, name, profile_picture, company_name, industry, created_at 
      FROM users 
      WHERE role = 'client' 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getAllFreelancers() {
    const query = `
      SELECT id, email, name, profile_picture, skills, hourly_rate, location, created_at 
      FROM users 
      WHERE role = 'freelancer' 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getUserStats(userId) {
    const query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.created_at,
        CASE 
          WHEN u.role = 'client' THEN (
            SELECT COUNT(*) FROM jobs WHERE client_id = u.id
          )
          ELSE (
            SELECT COUNT(*) FROM proposals WHERE freelancer_id = u.id
          )
        END as activity_count
      FROM users u
      WHERE u.id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = User;