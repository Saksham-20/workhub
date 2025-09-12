const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Simple CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://workhub-frontend.onrender.com',
    'https://workhub.onrender.com',
    'https://workhub-1-i1ga.onrender.com'
  ],
  credentials: true
}));

app.use(express.json());

// Test endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', req.body);
  res.json({ 
    status: 'OK', 
    message: 'Login endpoint accessible',
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
