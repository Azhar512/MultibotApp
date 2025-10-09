// Simple test script to verify API integrations
const testHuggingFaceAPI = async () => {
  console.log('🧪 Testing HuggingFace API integration...')
  
  try {
    // Test the HuggingFace service
    const { default: huggingfaceService } = await import('./src/services/huggingfaceService.js')
    
    // Test connection
    console.log('📡 Testing connection...')
    const connectionResult = await huggingfaceService.testConnection()
    console.log('Connection result:', connectionResult)
    
    // Test text generation
    console.log('🤖 Testing text generation...')
    const textResult = await huggingfaceService.generateText('Hello, how are you?', 'microsoft/DialoGPT-small')
    console.log('Text generation result:', textResult)
    
    console.log('✅ HuggingFace API test completed successfully!')
    
  } catch (error) {
    console.error('❌ HuggingFace API test failed:', error.message)
  }
}

const testBotService = async () => {
  console.log('🧪 Testing Bot Service integration...')
  
  try {
    const { botAPI } = await import('./src/services/botService.js')
    
    // Test available models
    console.log('📋 Testing available models...')
    const models = botAPI.getAvailableModels()
    console.log('Available models:', models.length)
    
    console.log('✅ Bot Service test completed successfully!')
    
  } catch (error) {
    console.error('❌ Bot Service test failed:', error.message)
  }
}

const runTests = async () => {
  console.log('🚀 Starting API integration tests...\n')
  
  await testBotService()
  console.log('')
  
  // Note: HuggingFace test requires API key, so we'll skip it for now
  // await testHuggingFaceAPI()
  
  console.log('🎉 All tests completed!')
}

runTests().catch(console.error)
