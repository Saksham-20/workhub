require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const proposalRoutes = require('./routes/proposals');
const profileRoutes = require('./routes/profile');
const { pool } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://workhub-frontend.onrender.com',
    'https://workhub.onrender.com',
    'https://workhub-1-i1ga.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly for all routes
app.options('*', cors(corsOptions));

app.use(express.json());

// Add CORS headers to all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'https://workhub-frontend.onrender.com',
    'https://workhub.onrender.com',
    'https://workhub-1-i1ga.onrender.com'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Log CORS requests for debugging
  if (req.method === 'OPTIONS') {
    console.log('CORS preflight request from:', origin);
  }
  
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'WorkHub API is running',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    fixes: 'CORS and login issues resolved'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});

// Setup endpoint for creating demo accounts
app.post('/api/setup-demo', async (req, res) => {
  try {
    const { createSimpleDemoAccounts } = require('./create_simple_demo');
    await createSimpleDemoAccounts();
    res.json({ 
      status: 'OK', 
      message: 'Demo accounts created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Setup demo error:', error);
    res.status(500).json({ 
      error: 'Failed to create demo accounts',
      message: error.message 
    });
  }
});

// CORS test endpoint
app.post('/api/test-cors', (req, res) => {
  console.log('CORS test request from:', req.headers.origin);
  res.json({ 
    status: 'OK', 
    message: 'CORS test successful',
    origin: req.headers.origin,
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

// Login test endpoint with CORS debugging
app.post('/api/auth/test-login', (req, res) => {
  console.log('Test login request from:', req.headers.origin);
  console.log('Request headers:', req.headers);
  res.json({ 
    status: 'OK', 
    message: 'Login endpoint accessible',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Favicon handler
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Handle 404s
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Test database connection and run migrations on startup
const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connection successful');
    
    // Run migrations
    const { runMigrations } = require('./config/database');
    await runMigrations();
    console.log('✅ Database migrations completed');
    
    // Create demo accounts if they don't exist
    const { createSimpleDemoAccounts } = require('./create_simple_demo');
    await createSimpleDemoAccounts();
    console.log('✅ Demo accounts ready');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Deployment timestamp: ${new Date().toISOString()}`);
  console.log(`Version: 2.0.0 - Login fixes applied`);
  await initializeDatabase();
});