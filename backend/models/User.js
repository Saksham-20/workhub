const { pool } = require('../config/database');

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
    const query = 'SELECT id, email, name, role, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
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
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${paramCounter} 
      RETURNING id, email, name, role, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
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
      SELECT id, email, name, created_at 
      FROM users 
      WHERE role = 'client' 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getAllFreelancers() {
    const query = `
      SELECT id, email, name, created_at 
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