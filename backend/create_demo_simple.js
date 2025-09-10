const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');

async function createDemoAccounts() {
  try {
    console.log('Creating demo accounts...');
    
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    // Create demo freelancer
    const demoFreelancer = await pool.query(`
      INSERT INTO users (name, email, password, role, bio, location, hourly_rate, skills, languages, availability, experience_level, title, profile_picture)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
      RETURNING id
    `, [
      'Sarah Johnson',
      'sarah.demo@workhub.com',
      hashedPassword,
      'freelancer',
      'Experienced full-stack developer with 5+ years of expertise in React, Node.js, and cloud technologies. Passionate about creating scalable web applications and helping businesses grow through technology.',
      'San Francisco, CA',
      75,
      ['React', 'Node.js', 'JavaScript', 'Python', 'AWS', 'MongoDB', 'PostgreSQL', 'TypeScript'],
      JSON.stringify(['English', 'Spanish']),
      'Available',
      'Senior',
      'Senior Full-Stack Developer',
      'https://via.placeholder.com/150x150'
    ]);
    
    console.log('Demo freelancer created with ID:', demoFreelancer.rows[0].id);
    
    // Create demo client
    const demoClient = await pool.query(`
      INSERT INTO users (name, email, password, role, bio, location, company_name, company_description, industry, company_size, title, profile_picture)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING id
    `, [
      'Michael Chen',
      'michael.demo@workhub.com',
      hashedPassword,
      'client',
      'CEO and Founder of InnovateTech, a fast-growing startup focused on AI and machine learning solutions. Looking for talented developers to help us build the next generation of intelligent applications.',
      'New York, NY',
      'InnovateTech',
      'InnovateTech is a cutting-edge technology company specializing in artificial intelligence and machine learning solutions. We help businesses transform their operations through intelligent automation and data-driven insights.',
      'Technology',
      '11-50 employees',
      'CEO & Founder',
      'https://via.placeholder.com/150x150'
    ]);
    
    console.log('Demo client created with ID:', demoClient.rows[0].id);
    
    return {
      freelancerId: demoFreelancer.rows[0].id,
      clientId: demoClient.rows[0].id
    };
    
  } catch (error) {
    console.error('Error creating demo accounts:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  createDemoAccounts()
    .then(({ freelancerId, clientId }) => {
      console.log('Demo accounts created successfully!');
      console.log('Freelancer ID:', freelancerId);
      console.log('Client ID:', clientId);
      console.log('\nDemo Account Credentials:');
      console.log('Freelancer: sarah.demo@workhub.com / demo123');
      console.log('Client: michael.demo@workhub.com / demo123');
      process.exit(0);
    })
    .catch(error => {
      console.error('Failed to create demo accounts:', error);
      process.exit(1);
    });
}

module.exports = { createDemoAccounts };
