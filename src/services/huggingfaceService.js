import { config, API_ENDPOINTS } from '../config/environment'
import { secureStorage } from '../utils/secureStorage'

class HuggingFaceService {
  constructor() {
    this.baseURL = config.HUGGINGFACE_API_URL
    this.timeout = config.API_TIMEOUT
    this.apiKey = null
  }

  async initialize() {
    try {
      // Try to get API key from secure storage first
      this.apiKey = await secureStorage.getItem('huggingface_api_key')
      
      if (!this.apiKey) {
        console.warn('HuggingFace API key not found in storage')
        return false
      }
      
      return true
    } catch (error) {
      console.error('Failed to initialize HuggingFace service:', error)
      return false
    }
  }

  async setApiKey(apiKey) {
    try {
      await secureStorage.setItem('huggingface_api_key', apiKey)
      this.apiKey = apiKey
      return true
    } catch (error) {
      console.error('Failed to set HuggingFace API key:', error)
      return false
    }
  }

  async makeRequest(model, inputs, parameters = {}) {
    if (!this.apiKey) {
      throw new Error('HuggingFace API key not configured')
    }

    const url = `${this.baseURL}/${model}`
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
          repetition_penalty: 1.1,
          ...parameters
        },
        options: {
          wait_for_model: true,
          use_cache: false,
        }
      })
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`HuggingFace API error: ${response.status} - ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      return this.processResponse(data, inputs)
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again')
      }
      throw error
    }
  }

  processResponse(data, originalInput) {
    let generatedText = ''
    
    if (Array.isArray(data) && data.length > 0) {
      generatedText = data[0].generated_text || data[0].text || ''
    } else if (data.generated_text) {
      generatedText = data.generated_text
    } else if (data.text) {
      generatedText = data.text
    }

    // Clean up the response
    if (generatedText) {
      // Remove the original input from the response
      generatedText = generatedText.replace(originalInput, '').trim()
      
      // Clean up common artifacts
      generatedText = generatedText
        .replace(/^(Human:|User:|Bot:|Assistant:|Answer:)/i, '')
        .replace(/(Human:|User:|Bot:|Assistant:)$/i, '')
        .replace(/^\s*[-•]\s*/, '')
        .replace(/\n\n+/g, '\n')
        .replace(/\s+/g, ' ')
        .trim()
    }

    return {
      text: generatedText || 'I apologize, but I was unable to generate a response.',
      confidence: 0.75,
      model: 'huggingface',
      timestamp: new Date().toISOString()
    }
  }

  async generateText(message, model = 'microsoft/DialoGPT-medium', personality = {}) {
    try {
      const processedInput = this.preprocessInput(message, personality)
      const result = await this.makeRequest(model, processedInput)
      
      // Apply personality adjustments
      result.text = this.adjustResponseByPersonality(result.text, personality)
      
      return result
    } catch (error) {
      console.error('Text generation failed:', error)
      return {
        text: 'I apologize, but I\'m experiencing technical difficulties. Please try again.',
        confidence: 0.3,
        model: 'huggingface',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  preprocessInput(message, personality) {
    const { Empathy = 70, Assertiveness = 60, Humour = 50, Patience = 80, Confidence = 60 } = personality

    const traits = []
    if (Empathy > 75) traits.push('empathetic and understanding')
    if (Assertiveness > 75) traits.push('confident and direct')
    if (Humour > 70) traits.push('friendly with appropriate humor')
    if (Patience > 80) traits.push('patient and thoughtful')
    if (Confidence > 75) traits.push('knowledgeable and assured')

    let systemPrompt = 'You are a helpful AI assistant.'
    if (traits.length > 0) {
      systemPrompt = `You are a helpful AI assistant that is ${traits.join(', ')}.`
    }

    return `${systemPrompt}\n\nUser: ${message}\nAssistant:`
  }

  adjustResponseByPersonality(response, personality) {
    try {
      let adjustedResponse = response.toString()

      if (personality.Empathy >= 70) {
        adjustedResponse = `I understand your question. ${adjustedResponse}`
      }

      if (personality.Assertiveness >= 70) {
        adjustedResponse = adjustedResponse
          .replace(/might|maybe|possibly/gi, 'definitely')
          .replace(/could|should/gi, 'will')
      }

      if (personality.Humour >= 70 && !adjustedResponse.includes('error') && !adjustedResponse.includes('apologize')) {
        const emojis = ['😊', '😄', '👍', '✨']
        adjustedResponse += ` ${emojis[Math.floor(Math.random() * emojis.length)]}`
      }

      return adjustedResponse
    } catch (error) {
      console.error('Error in personality adjustment:', error)
      return response
    }
  }

  async testConnection() {
    try {
      const result = await this.makeRequest('google/flan-t5-small', 'Answer: What is 2+2?', {
        max_new_tokens: 10,
        temperature: 0.1
      })
      
      return {
        success: true,
        response: result.text,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  getAvailableModels() {
    return [
      { id: 'microsoft/DialoGPT-small', name: 'DialoGPT Small', description: 'Small conversational model' },
      { id: 'microsoft/DialoGPT-medium', name: 'DialoGPT Medium', description: 'Medium conversational model' },
      { id: 'microsoft/DialoGPT-large', name: 'DialoGPT Large', description: 'Large conversational model' },
      { id: 'facebook/blenderbot-400M-distill', name: 'BlenderBot 400M', description: 'Facebook conversational model' },
      { id: 'google/flan-t5-small', name: 'FLAN-T5 Small', description: 'Google instruction-following model' },
      { id: 'google/flan-t5-base', name: 'FLAN-T5 Base', description: 'Google instruction-following model' },
      { id: 'gpt2', name: 'GPT-2', description: 'OpenAI GPT-2 model' },
      { id: 'distilgpt2', name: 'DistilGPT-2', description: 'Distilled GPT-2 model' }
    ]
  }
}

export default new HuggingFaceService()
