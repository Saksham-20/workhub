const axios = require('axios');

async function testEnhancedLogs() {
  console.log('🧪 Testing Enhanced Logging');
  console.log('===========================');
  
  try {
    console.log('\n📡 Testing local server with enhanced logs...');
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'sarah.demo@workhub.com',
      password: 'demo123'
    });
    
    console.log('✅ Login successful locally');
    console.log('👤 User:', response.data.user.name);
    console.log('🎭 Role:', response.data.user.role);
    console.log('');
    console.log('📋 Check your local server terminal for enhanced logs:');
    console.log('   Look for: 🔐 LOGIN ATTEMPT START');
    console.log('   Look for: ✅ LOGIN SUCCESSFUL');
    console.log('   Look for: 👤 User: sarah.demo@workhub.com');
    
  } catch (error) {
    console.log('❌ Local test failed:', error.message);
    console.log('Make sure local server is running: ./start-local.sh');
  }
  
  console.log('\n🚀 Ready to deploy enhanced logging!');
  console.log('Run: ./deploy-logging-fix.sh');
}

testEnhancedLogs().catch(console.error);
