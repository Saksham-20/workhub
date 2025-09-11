const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');

async function createSimpleDemoAccounts() {
  try {
    console.log('Creating simple demo accounts...');
    
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    // Check if accounts already exist
    const existingFreelancer = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['sarah.demo@workhub.com']
    );
    
    const existingClient = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['michael.demo@workhub.com']
    );
    
    if (existingFreelancer.rows.length > 0) {
      console.log('Demo freelancer already exists');
    } else {
      // Create demo freelancer
      const demoFreelancer = await pool.query(`
        INSERT INTO users (name, email, password, role) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id
      `, [
        'Sarah Johnson',
        'sarah.demo@workhub.com',
        hashedPassword,
        'freelancer'
      ]);
      
      console.log('Demo freelancer created with ID:', demoFreelancer.rows[0].id);
    }
    
    if (existingClient.rows.length > 0) {
      console.log('Demo client already exists');
    } else {
      // Create demo client
      const demoClient = await pool.query(`
        INSERT INTO users (name, email, password, role) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id
      `, [
        'Michael Chen',
        'michael.demo@workhub.com',
        hashedPassword,
        'client'
      ]);
      
      console.log('Demo client created with ID:', demoClient.rows[0].id);
    }
    
    console.log('Simple demo accounts setup complete!');
    console.log('You can now login with:');
    console.log('Freelancer: sarah.demo@workhub.com / demo123');
    console.log('Client: michael.demo@workhub.com / demo123');
    
  } catch (error) {
    console.error('Error creating simple demo accounts:', error);
    throw error;
  }
}

module.exports = { createSimpleDemoAccounts };

// Run if called directly
if (require.main === module) {
  createSimpleDemoAccounts()
    .then(() => {
      console.log('Demo accounts created successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Failed to create demo accounts:', error);
      process.exit(1);
    });
}
