const { pool } = require('./config/database');

async function createDemoProposals() {
  try {
    console.log('Creating demo proposals...');
    
    // Get the demo freelancer ID
    const freelancerResult = await pool.query('SELECT id FROM users WHERE email = $1', ['sarah.demo@workhub.com']);
    const freelancerId = freelancerResult.rows[0].id;
    
    // Get some demo jobs
    const jobsResult = await pool.query('SELECT id, title FROM jobs WHERE client_id = (SELECT id FROM users WHERE email = $1) ORDER BY id LIMIT 3', ['michael.demo@workhub.com']);
    const jobs = jobsResult.rows;
    
    const demoProposals = [
      {
        jobId: jobs[0].id,
        coverLetter: 'I am very excited about this AI-powered e-commerce platform project! With my 5+ years of experience in React, Node.js, and cloud technologies, I believe I can deliver exactly what you need. I have previously built similar platforms and have extensive experience with AI integration. I am confident I can complete this project within your timeline and budget.',
        bidAmount: 14000,
        status: 'pending'
      },
      {
        jobId: jobs[1].id,
        coverLetter: 'This mobile app project aligns perfectly with my expertise in React Native and real-time applications. I have built several task management apps with offline capabilities and real-time sync. My experience with Firebase and Redux will ensure a smooth development process.',
        bidAmount: 7500,
        status: 'accepted'
      },
      {
        jobId: jobs[2].id,
        coverLetter: 'I am passionate about machine learning and have extensive experience with Python, TensorFlow, and customer analytics. I have worked on similar projects in the past and can provide valuable insights into customer behavior patterns. I am excited to help you build this predictive model.',
        bidAmount: 11000,
        status: 'pending'
      }
    ];
    
    const createdProposals = [];
    
    for (const proposal of demoProposals) {
      const result = await pool.query(`
        INSERT INTO proposals (job_id, freelancer_id, cover_letter, bid_amount, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, job_id, bid_amount, status
      `, [
        proposal.jobId,
        freelancerId,
        proposal.coverLetter,
        proposal.bidAmount,
        proposal.status
      ]);
      
      createdProposals.push(result.rows[0]);
      console.log(`Created proposal for job ${result.rows[0].job_id} with bid ₹${result.rows[0].bid_amount} (Status: ${result.rows[0].status})`);
    }
    
    console.log(`\nCreated ${createdProposals.length} demo proposals successfully!`);
    return createdProposals;
    
  } catch (error) {
    console.error('Error creating demo proposals:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  createDemoProposals()
    .then(() => {
      console.log('Demo proposals creation completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Failed to create demo proposals:', error);
      process.exit(1);
    });
}

module.exports = { createDemoProposals };
