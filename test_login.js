const axios = require('axios');

const API_URL = 'https://workhub-backend.onrender.com';

async function testLogin() {
  try {
    console.log('Testing login functionality...');
    
    // Test health endpoint first
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test CORS endpoint
    console.log('2. Testing CORS endpoint...');
    const corsResponse = await axios.post(`${API_URL}/api/test-cors`, {
      test: 'cors test'
    });
    console.log('✅ CORS test passed:', corsResponse.data);
    
    // Test login with demo account
    console.log('3. Testing login with demo account...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'michael.demo@workhub.com',
      password: 'demo123'
    });
    console.log('✅ Login successful:', {
      user: loginResponse.data.user,
      hasToken: !!loginResponse.data.token
    });
    
    console.log('\n🎉 All tests passed! Login functionality is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    if (error.response?.status === 500) {
      console.log('\n🔍 500 Error Details:');
      console.log('This could be due to:');
      console.log('1. Database connection issues');
      console.log('2. Missing environment variables');
      console.log('3. Database migrations not run');
      console.log('4. Demo accounts not created');
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('\n🔍 Connection Error:');
      console.log('The backend server might not be running or accessible.');
    }
  }
}

// Run the test
testLogin();
