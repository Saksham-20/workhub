const axios = require('axios');

async function checkDeploymentStatus() {
  console.log('🔍 Checking Deployment Status');
  console.log('=============================');
  
  const frontendUrl = 'https://workhub-1-i1ga.onrender.com';
  const backendUrl = 'https://workhub-jj2l.onrender.com';
  
  try {
    // Check frontend
    console.log('\n1. Checking frontend...');
    const frontendResponse = await axios.get(frontendUrl);
    console.log('✅ Frontend: DEPLOYED');
    console.log('   Status:', frontendResponse.status);
    console.log('   Content-Type:', frontendResponse.headers['content-type']);
  } catch (error) {
    console.log('❌ Frontend: NOT READY');
    console.log('   Error:', error.message);
  }

  try {
    // Check backend
    console.log('\n2. Checking backend...');
    const backendResponse = await axios.get(`${backendUrl}/api/health`);
    console.log('✅ Backend: WORKING');
    console.log('   Status:', backendResponse.status);
    console.log('   Version:', backendResponse.data.version);
  } catch (error) {
    console.log('❌ Backend: NOT WORKING');
    console.log('   Error:', error.message);
  }

  try {
    // Test CORS
    console.log('\n3. Testing CORS...');
    const corsResponse = await axios.post(`${backendUrl}/api/auth/login`, {
      email: 'sarah.demo@workhub.com',
      password: 'demo123'
    }, {
      headers: {
        'Origin': frontendUrl,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ CORS: WORKING');
    console.log('   Login successful for:', corsResponse.data.user.email);
  } catch (error) {
    console.log('❌ CORS: NOT WORKING');
    console.log('   Error:', error.response?.data || error.message);
  }

  console.log('\n📋 Next Steps:');
  console.log('==============');
  console.log('1. Wait 5-7 minutes for frontend rebuild to complete');
  console.log('2. Go to https://workhub-1-i1ga.onrender.com/login');
  console.log('3. Open browser console (F12) and look for:');
  console.log('   🔍 API Configuration:');
  console.log('   Final API_URL: https://workhub-jj2l.onrender.com');
  console.log('4. If you see the correct URL, try logging in');
  console.log('5. If you still see workhub-backend.onrender.com, wait longer');
}

checkDeploymentStatus().catch(console.error);

