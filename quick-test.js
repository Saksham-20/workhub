const axios = require('axios');

async function quickTest() {
  console.log('🔍 Quick WorkHub Status Check');
  console.log('==============================');
  
  try {
    // Test backend health
    console.log('\n1. Testing backend health...');
    const healthResponse = await axios.get('https://workhub-backend.onrender.com/api/health');
    console.log('✅ Backend health: OK');
    console.log('   Response:', healthResponse.data);
  } catch (error) {
    console.log('❌ Backend health: FAILED');
    console.log('   Error:', error.response?.status || error.message);
  }

  try {
    // Test login
    console.log('\n2. Testing login...');
    const loginResponse = await axios.post('https://workhub-backend.onrender.com/api/auth/login', {
      email: 'michael.demo@workhub.com',
      password: 'demo123'
    });
    console.log('✅ Login: SUCCESS');
    console.log('   User:', loginResponse.data.user.name);
    console.log('   Role:', loginResponse.data.user.role);
  } catch (error) {
    console.log('❌ Login: FAILED');
    console.log('   Error:', error.response?.data || error.message);
  }

  try {
    // Test frontend
    console.log('\n3. Testing frontend...');
    const frontendResponse = await axios.get('https://workhub-1-i1ga.onrender.com');
    console.log('✅ Frontend: ACCESSIBLE');
    console.log('   Status:', frontendResponse.status);
  } catch (error) {
    console.log('❌ Frontend: FAILED');
    console.log('   Error:', error.message);
  }

  console.log('\n📋 Summary:');
  console.log('============');
  console.log('If you see ❌ errors above, the backend needs to be redeployed.');
  console.log('Go to https://render.com and force redeploy your workhub-backend service.');
  console.log('\n🔑 Demo Credentials:');
  console.log('   Email: michael.demo@workhub.com');
  console.log('   Password: demo123');
}

quickTest().catch(console.error);
