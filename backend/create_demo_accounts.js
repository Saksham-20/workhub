const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');

async function createDemoAccounts() {
  try {
    console.log('Creating demo accounts...');
    
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    // Create demo freelancer
    const demoFreelancer = await pool.query(`
      INSERT INTO users (
        name, email, password, role, bio, location, hourly_rate, 
        skills, languages, availability, experience_level, education, 
        certifications, portfolio, testimonials, employment_history, 
        other_experiences, profile_picture, title, profile_boost, 
        social_links, licenses, verifications
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) 
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
      JSON.stringify({ degree: 'Bachelor of Computer Science', institution: 'Stanford University', year: '2019' }),
      JSON.stringify([
        { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
        { name: 'Google Cloud Professional Developer', issuer: 'Google', year: '2022' }
      ]),
      JSON.stringify([
        { title: 'E-commerce Platform', description: 'Built a full-stack e-commerce platform using React and Node.js', url: 'https://github.com/sarah/ecommerce-platform', image: 'https://via.placeholder.com/300x200' },
        { title: 'Task Management App', description: 'Created a collaborative task management application with real-time updates', url: 'https://github.com/sarah/task-manager', image: 'https://via.placeholder.com/300x200' }
      ]),
      JSON.stringify([
        { author: 'John Smith, CEO at TechCorp', text: 'Sarah delivered exceptional work on our project. Her attention to detail and communication skills are outstanding.' },
        { author: 'Lisa Chen, Product Manager', text: 'Working with Sarah was a pleasure. She understood our requirements perfectly and delivered ahead of schedule.' }
      ]),
      JSON.stringify([
        { company: 'Google', position: 'Senior Software Engineer', duration: '2021-2023', description: 'Led development of microservices architecture for cloud platform' },
        { company: 'Microsoft', position: 'Software Engineer', duration: '2019-2021', description: 'Developed React applications for enterprise clients' }
      ]),
      JSON.stringify([
        { title: 'Open Source Contributor', description: 'Active contributor to React and Node.js open source projects' },
        { title: 'Tech Speaker', description: 'Regular speaker at JavaScript and React conferences' }
      ]),
      'https://via.placeholder.com/150x150',
      'Senior Full-Stack Developer',
      false,
      JSON.stringify([]),
      JSON.stringify([]),
      JSON.stringify([])
    ]);
    
    console.log('Demo freelancer created with ID:', demoFreelancer.rows[0].id);
    
    // Create demo client
    const demoClient = await pool.query(`
      INSERT INTO users (
        name, email, password, role, bio, location, hourly_rate, 
        skills, languages, availability, experience_level, education, 
        certifications, portfolio, testimonials, employment_history, 
        other_experiences, profile_picture, title, profile_boost, 
        company_description, company_name, industry, company_size, social_links, licenses, verifications
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27) 
      RETURNING id
    `, [
      'Michael Chen',
      'michael.demo@workhub.com',
      hashedPassword,
      'client',
      'CEO and Founder of InnovateTech, a fast-growing startup focused on AI and machine learning solutions. Looking for talented developers to help us build the next generation of intelligent applications.',
      'New York, NY',
      null,
      [],
      JSON.stringify(['English', 'Mandarin']),
      null,
      null,
      JSON.stringify({ degree: 'MBA', institution: 'Harvard Business School', year: '2018' }),
      JSON.stringify([]),
      JSON.stringify([]),
      JSON.stringify([]),
      JSON.stringify([
        { company: 'InnovateTech', position: 'CEO & Founder', duration: '2020-Present', description: 'Leading a team of 15+ developers and designers to build AI-powered solutions' },
        { company: 'Goldman Sachs', position: 'VP of Technology', duration: '2018-2020', description: 'Managed technology initiatives for investment banking division' }
      ]),
      JSON.stringify([]),
      'https://via.placeholder.com/150x150',
      'CEO & Founder',
      false,
      'InnovateTech is a cutting-edge technology company specializing in artificial intelligence and machine learning solutions. We help businesses transform their operations through intelligent automation and data-driven insights. Our team of expert developers and data scientists work together to create innovative products that solve real-world problems.',
      'InnovateTech',
      'Technology',
      '11-50 employees',
      JSON.stringify([]),
      JSON.stringify([]),
      JSON.stringify([])
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

module.exports = { createDemoAccounts };

// Run if called directly
if (require.main === module) {
  createDemoAccounts()
    .then(({ freelancerId, clientId }) => {
      console.log('Demo accounts created successfully!');
      console.log('Freelancer ID:', freelancerId);
      console.log('Client ID:', clientId);
      process.exit(0);
    })
    .catch(error => {
      console.error('Failed to create demo accounts:', error);
      process.exit(1);
    });
}
