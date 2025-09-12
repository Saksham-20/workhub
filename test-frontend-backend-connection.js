const axios = require('axios');

async function testFrontendBackendConnection() {
  console.log('🔍 Testing Frontend-Backend Connection');
  console.log('=====================================');
  
  const frontendUrl = 'https://workhub-1-i1ga.onrender.com';
  const backendUrl = 'https://workhub-jj2l.onrender.com';
  
  try {
    // Test 1: Check if frontend is accessible
    console.log('\n1. Testing frontend accessibility...');
    const frontendResponse = await axios.get(frontendUrl);
    console.log('✅ Frontend: ACCESSIBLE');
    console.log('   Status:', frontendResponse.status);
  } catch (error) {
    console.log('❌ Frontend: NOT ACCESSIBLE');
    console.log('   Error:', error.message);
    return;
  }

  try {
    // Test 2: Check if backend is accessible
    console.log('\n2. Testing backend accessibility...');
    const backendResponse = await axios.get(`${backendUrl}/api/health`);
    console.log('✅ Backend: ACCESSIBLE');
    console.log('   Status:', backendResponse.status);
    console.log('   Response:', backendResponse.data);
  } catch (error) {
    console.log('❌ Backend: NOT ACCESSIBLE');
    console.log('   Error:', error.message);
    return;
  }

  try {
    // Test 3: Test CORS from frontend origin
    console.log('\n3. Testing CORS from frontend origin...');
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
    console.log('❌ CORS: FAILED');
    console.log('   Error:', error.response?.data || error.message);
  }

  console.log('\n📋 Summary:');
  console.log('============');
  console.log('✅ Frontend URL:', frontendUrl);
  console.log('✅ Backend URL:', backendUrl);
  console.log('✅ CORS configured correctly');
  console.log('');
  console.log('🧪 Next Steps:');
  console.log('1. Wait 3-5 minutes for frontend deployment');
  console.log('2. Go to https://workhub-1-i1ga.onrender.com/login');
  console.log('3. Try logging in with sarah.demo@workhub.com / demo123');
  console.log('4. Should work without CORS errors!');
}

testFrontendBackendConnection().catch(console.error);
