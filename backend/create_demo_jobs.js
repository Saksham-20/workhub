const { pool } = require('./config/database');

async function createDemoJobs() {
  try {
    console.log('Creating demo jobs...');
    
    // Get the demo client ID
    const clientResult = await pool.query('SELECT id FROM users WHERE email = $1', ['michael.demo@workhub.com']);
    const clientId = clientResult.rows[0].id;
    
    const demoJobs = [
      {
        title: 'Build AI-Powered E-commerce Platform',
        description: 'We need a skilled full-stack developer to build a modern e-commerce platform with AI-powered product recommendations, personalized shopping experiences, and advanced analytics dashboard. The platform should handle high traffic and integrate with various payment gateways.',
        skills: ['React', 'Node.js', 'Python', 'Machine Learning', 'AWS', 'MongoDB'],
        budget: 15000,
        timeline: 'less-than-6-months',
        status: 'open'
      },
      {
        title: 'Develop Mobile App for Task Management',
        description: 'Looking for a mobile app developer to create a cross-platform task management application with real-time collaboration features, push notifications, and offline capabilities. The app should sync with our existing web platform.',
        skills: ['React Native', 'JavaScript', 'Firebase', 'Redux', 'iOS', 'Android'],
        budget: 8000,
        timeline: '1-3-months',
        status: 'open'
      },
      {
        title: 'Create Machine Learning Model for Customer Analytics',
        description: 'We need a data scientist to develop a machine learning model that analyzes customer behavior patterns and predicts purchasing trends. The model should integrate with our existing data pipeline and provide actionable insights.',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'Scikit-learn', 'SQL'],
        budget: 12000,
        timeline: 'less-than-6-months',
        status: 'open'
      },
      {
        title: 'Design and Implement Cloud Infrastructure',
        description: 'Seeking a DevOps engineer to design and implement a scalable cloud infrastructure using AWS. The infrastructure should support our growing user base and ensure high availability and security.',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'CI/CD'],
        budget: 10000,
        timeline: '1-3-months',
        status: 'in_progress'
      },
      {
        title: 'Build Real-time Chat Application',
        description: 'We need a developer to create a real-time chat application with video calling capabilities, file sharing, and group management features. The application should be scalable and support thousands of concurrent users.',
        skills: ['WebRTC', 'Socket.io', 'Node.js', 'React', 'MongoDB', 'Redis'],
        budget: 6000,
        timeline: 'less-than-1-month',
        status: 'open'
      }
    ];
    
    const createdJobs = [];
    
    for (const job of demoJobs) {
      const result = await pool.query(`
        INSERT INTO jobs (title, description, skills, budget, timeline, status, client_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, title
      `, [
        job.title,
        job.description,
        job.skills,
        job.budget,
        job.timeline,
        job.status,
        clientId
      ]);
      
      createdJobs.push(result.rows[0]);
      console.log(`Created job: ${result.rows[0].title} (ID: ${result.rows[0].id})`);
    }
    
    console.log(`\nCreated ${createdJobs.length} demo jobs successfully!`);
    return createdJobs;
    
  } catch (error) {
    console.error('Error creating demo jobs:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  createDemoJobs()
    .then(() => {
      console.log('Demo jobs creation completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Failed to create demo jobs:', error);
      process.exit(1);
    });
}

module.exports = { createDemoJobs };
