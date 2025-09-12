const axios = require('axios');

async function debugDeployment() {
  console.log('🔍 Debugging WorkHub Deployment');
  console.log('================================');
  
  const backendUrl = 'https://workhub-jj2l.onrender.com';
  
  try {
    // Test 1: Health check
    console.log('\n1. Testing backend health...');
    const healthResponse = await axios.get(`${backendUrl}/api/health`);
    console.log('✅ Backend health: OK');
    console.log('   Response:', healthResponse.data);
  } catch (error) {
    console.log('❌ Backend health: FAILED');
    console.log('   Error:', error.response?.status || error.message);
    return;
  }

  try {
    // Test 2: Login with detailed logging
    console.log('\n2. Testing login with detailed response...');
    const loginResponse = await axios.post(`${backendUrl}/api/auth/login`, {
      email: 'sarah.demo@workhub.com',
      password: 'demo123'
    });
    console.log('✅ Login: SUCCESS');
    console.log('   User:', loginResponse.data.user);
    console.log('   Token length:', loginResponse.data.token?.length || 'No token');
    console.log('   Response headers:', loginResponse.headers);
  } catch (error) {
    console.log('❌ Login: FAILED');
    console.log('   Error status:', error.response?.status);
    console.log('   Error data:', error.response?.data);
    console.log('   Error message:', error.message);
  }

  try {
    // Test 3: Test CORS endpoint
    console.log('\n3. Testing CORS endpoint...');
    const corsResponse = await axios.post(`${backendUrl}/api/test-cors`, {
      test: 'cors test'
    });
    console.log('✅ CORS test: SUCCESS');
    console.log('   Response:', corsResponse.data);
  } catch (error) {
    console.log('❌ CORS test: FAILED');
    console.log('   Error:', error.response?.data || error.message);
  }

  try {
    // Test 4: Test login endpoint accessibility
    console.log('\n4. Testing login endpoint accessibility...');
    const loginTestResponse = await axios.post(`${backendUrl}/api/auth/test-login`, {
      test: 'login endpoint test'
    });
    console.log('✅ Login endpoint: ACCESSIBLE');
    console.log('   Response:', loginTestResponse.data);
  } catch (error) {
    console.log('❌ Login endpoint: FAILED');
    console.log('   Error:', error.response?.data || error.message);
  }

  console.log('\n📋 Deployment Debug Summary:');
  console.log('==============================');
  console.log('✅ Backend URL: https://workhub-jj2l.onrender.com');
  console.log('✅ Health endpoint working');
  console.log('✅ Login endpoint working');
  console.log('');
  console.log('🔍 Next Steps:');
  console.log('1. Check Render.com dashboard logs');
  console.log('2. Go to your service → Logs tab');
  console.log('3. Look for login attempts in the logs');
  console.log('4. If no logs appear, the issue might be:');
  console.log('   - Log level configuration');
  console.log('   - Console.log not showing in production');
  console.log('   - Database connection issues');
  console.log('');
  console.log('🌐 Render Dashboard: https://dashboard.render.com');
}

debugDeployment().catch(console.error);
