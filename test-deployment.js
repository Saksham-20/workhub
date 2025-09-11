const axios = require('axios');

const BACKEND_URL = 'https://workhub-backend.onrender.com';
const FRONTEND_URL = 'https://workhub-1-i1ga.onrender.com';

async function testDeployment() {
  console.log('🧪 Testing WorkHub Deployment');
  console.log('==============================');
  
  const tests = [
    {
      name: 'Backend Health Check',
      test: async () => {
        const response = await axios.get(`${BACKEND_URL}/api/health`);
        return response.data.status === 'OK';
      }
    },
    {
      name: 'Backend CORS Test',
      test: async () => {
        const response = await axios.post(`${BACKEND_URL}/api/test-cors`, {
          test: 'cors test'
        });
        return response.data.status === 'OK';
      }
    },
    {
      name: 'Login Test - Client',
      test: async () => {
        const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
          email: 'michael.demo@workhub.com',
          password: 'demo123'
        });
        return response.data.token && response.data.user;
      }
    },
    {
      name: 'Login Test - Freelancer',
      test: async () => {
        const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
          email: 'sarah.demo@workhub.com',
          password: 'demo123'
        });
        return response.data.token && response.data.user;
      }
    },
    {
      name: 'Frontend Accessibility',
      test: async () => {
        const response = await axios.get(FRONTEND_URL);
        return response.status === 200;
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n🔍 Testing: ${test.name}`);
      const result = await test.test();
      if (result) {
        console.log(`✅ ${test.name} - PASSED`);
        passed++;
      } else {
        console.log(`❌ ${test.name} - FAILED`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - FAILED`);
      console.log(`   Error: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data)}`);
      }
      failed++;
    }
  }

  console.log('\n📊 Test Results');
  console.log('================');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your WorkHub deployment is working perfectly!');
    console.log('\n🔑 Demo Credentials:');
    console.log('   Client: michael.demo@workhub.com / demo123');
    console.log('   Freelancer: sarah.demo@workhub.com / demo123');
    console.log('\n🌐 URLs:');
    console.log(`   Frontend: ${FRONTEND_URL}`);
    console.log(`   Backend: ${BACKEND_URL}`);
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above for details.');
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Wait a few more minutes for deployment to complete');
    console.log('   2. Check Render dashboard for deployment status');
    console.log('   3. Verify environment variables are set correctly');
    console.log('   4. Check server logs for errors');
  }
}

// Run the tests
testDeployment().catch(console.error);
