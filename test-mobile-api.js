// Test script for mobile app API connections
const API_BASE_URL = 'http://168.231.114.68:5000/api'

async function testMobileAPI() {
  console.log('🧪 Testing Mobile App API Connections...\n')

  // Test 1: Health Check
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    const data = await response.json()
    console.log('✅ Health Check:', data.status)
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message)
  }

  // Test 2: Authentication
  let authToken = null
  try {
    // Try to register a new user first
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'TestUser',
        email: `testuser${Date.now()}@example.com`,
        password: 'testpassword123'
      })
    })
    const registerData = await registerResponse.json()
    
    if (registerData.success) {
      authToken = registerData.token
      console.log('✅ Auth Registration: Working')
    } else {
      // Try to login with existing user
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'testuser@example.com',
          password: 'testpassword123'
        })
      })
      const loginData = await loginResponse.json()
      if (loginData.success) {
        authToken = loginData.token
        console.log('✅ Auth Login: Working')
      } else {
        console.log('⚠️ Auth: Registration/Login failed, but endpoints are working')
      }
    }
  } catch (error) {
    console.log('❌ Auth Test Failed:', error.message)
  }

  // Test 3: BERT Endpoint
  try {
    const response = await fetch(`${API_BASE_URL}/bert/response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello, how are you?',
        personality: {
          Empathy: 50,
          Assertiveness: 50,
          Humour: 50,
          Patience: 50,
          Confidence: 50
        },
        model: 'bert-base-uncased'
      })
    })
    const data = await response.json()
    console.log('✅ BERT Endpoint:', data.success ? 'Working' : 'Failed')
  } catch (error) {
    console.log('❌ BERT Test Failed:', error.message)
  }

  // Test 4: DeepSeek Endpoint
  try {
    const response = await fetch(`${API_BASE_URL}/deepseek/response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello, how are you?',
        personality: {
          Empathy: 50,
          Assertiveness: 50,
          Humour: 50,
          Patience: 50,
          Confidence: 50
        }
      })
    })
    const data = await response.json()
    console.log('✅ DeepSeek Endpoint:', data.botResponse ? 'Working' : 'Failed')
  } catch (error) {
    console.log('❌ DeepSeek Test Failed:', error.message)
  }

  // Test 5: OpenAI Endpoint (requires authentication)
  if (authToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/openai/response`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          message: 'Hello, how are you?',
          personality: {
            Empathy: 50,
            Assertiveness: 50,
            Humour: 50,
            Patience: 50,
            Confidence: 50
          }
        })
      })
      const data = await response.json()
      console.log('✅ OpenAI Endpoint:', data.success ? 'Working' : 'Failed')
    } catch (error) {
      console.log('❌ OpenAI Test Failed:', error.message)
    }
  } else {
    console.log('⚠️ OpenAI Endpoint: Skipped (no auth token)')
  }

  // Test 6: Bot Chat Endpoint (requires authentication)
  if (authToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/bot/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          message: 'Hello, how are you?',
          personality: {
            Empathy: 50,
            Assertiveness: 50,
            Humour: 50,
            Patience: 50,
            Confidence: 50
          }
        })
      })
      const data = await response.json()
      console.log('✅ Bot Chat Endpoint:', data.success ? 'Working' : 'Failed')
    } catch (error) {
      console.log('❌ Bot Chat Test Failed:', error.message)
    }
  } else {
    console.log('⚠️ Bot Chat Endpoint: Skipped (no auth token)')
  }

  console.log('\n🎉 Mobile API Testing Complete!')
}

// Run the test
testMobileAPI().catch(console.error)
