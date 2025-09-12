// Start script to ensure proper deployment
console.log('🚀 Starting WorkHub Backend...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', process.env.PORT || 5001);
console.log('Timestamp:', new Date().toISOString());

// Import and start the main server
require('./server.js');
