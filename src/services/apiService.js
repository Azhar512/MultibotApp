import { config, API_ENDPOINTS } from '../config/environment'
import secureStorage from '../utils/secureStorage'

class ApiService {
  constructor() {
    this.baseURL = config.API_BASE_URL
    this.timeout = config.API_TIMEOUT
    this.requestQueue = new Map()
  }

  // Get authorization headers
  async getAuthHeaders() {
    try {
      const token = await secureStorage.getItem('userToken')
      return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      }
    } catch (error) {
      console.error('Failed to get auth headers:', error)
      return {
        'Content-Type': 'application/json',
      }
    }
  }

  // Create request with timeout and retry logic
  async makeRequest(url, options = {}) {
    const requestId = `${url}-${Date.now()}`
    
    // Check if request is already in progress
    if (this.requestQueue.has(requestId)) {
      return this.requestQueue.get(requestId)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    const requestPromise = this._executeRequest(url, {
      ...options,
      signal: controller.signal,
    })

    // Store request in queue
    this.requestQueue.set(requestId, requestPromise)

    try {
      const result = await requestPromise
      return result
    } finally {
      clearTimeout(timeoutId)
      this.requestQueue.delete(requestId)
    }
  }

  // Execute the actual request
  async _executeRequest(url, options) {
    try {
      const response = await fetch(url, options)
      
      // Handle different response status codes
      if (!response.ok) {
        const errorData = await this._parseErrorResponse(response)
        throw new ApiError(
          errorData.message || 'Request failed',
          response.status,
          errorData
        )
      }

      const data = await this._parseResponse(response)
      return { success: true, data }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408)
      }
      throw error
    }
  }

  // Parse error response
  async _parseErrorResponse(response) {
    try {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }
      return { message: response.statusText || 'Unknown error' }
    } catch {
      return { message: 'Failed to parse error response' }
    }
  }

  // Parse successful response
  async _parseResponse(response) {
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }
    return await response.text()
  }

  // Authentication methods
  async login(email, password) {
    const url = `${this.baseURL}${API_ENDPOINTS.AUTH.LOGIN}`
    const headers = await this.getAuthHeaders()
    
    return this.makeRequest(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
    })
  }

  async register(name, email, password) {
    const url = `${this.baseURL}${API_ENDPOINTS.AUTH.REGISTER}`
    const headers = await this.getAuthHeaders()
    
    return this.makeRequest(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, email, password }),
    })
  }

  async validateToken() {
    const url = `${this.baseURL}${API_ENDPOINTS.AUTH.VALIDATE}`
    const headers = await this.getAuthHeaders()
    
    return this.makeRequest(url, {
      method: 'GET',
      headers,
    })
  }

  // Bot interaction methods
  async sendBotMessage(message, personality, config) {
    const url = `${this.baseURL}${API_ENDPOINTS.BOT.CHAT}`
    const headers = await this.getAuthHeaders()
    
    return this.makeRequest(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, personality, config }),
    })
  }

  async sendDeepSeekMessage(message, personality, config) {
    const url = `${this.baseURL}${API_ENDPOINTS.BOT.DEEPSEEK}`
    const headers = await this.getAuthHeaders()
    
    return this.makeRequest(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, personality, config }),
    })
  }

  async sendOpenAIMessage(message, personality, config, voiceType) {
    const url = `${this.baseURL}${API_ENDPOINTS.BOT.OPENAI}`
    const headers = await this.getAuthHeaders()
    
    return this.makeRequest(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, personality, config, voiceType }),
    })
  }

  async sendBERTMessage(message, personality, config, model) {
    const url = `${this.baseURL}${API_ENDPOINTS.BOT.BERT}`
    const headers = await this.getAuthHeaders()
    
    return this.makeRequest(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, personality, config, model }),
    })
  }

  // Twilio methods
  async getTwilioToken() {
    const url = `${config.TWILIO_API_URL}${API_ENDPOINTS.TWILIO.TOKEN}`
    const headers = await this.getAuthHeaders()
    
    return this.makeRequest(url, {
      method: 'GET',
      headers,
    })
  }

  async startCall(phoneNumber, personality, config) {
    const url = `${config.TWILIO_API_URL}${API_ENDPOINTS.TWILIO.CALL_START}`
    const headers = await this.getAuthHeaders()
    
    return this.makeRequest(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ phoneNumber, personality, config }),
    })
  }

  async endCall() {
    const url = `${config.TWILIO_API_URL}${API_ENDPOINTS.TWILIO.CALL_END}`
    const headers = await this.getAuthHeaders()
    
    return this.makeRequest(url, {
      method: 'POST',
      headers,
    })
  }

  // Dashboard methods
  async getDashboardStats() {
    const url = `${this.baseURL}${API_ENDPOINTS.DASHBOARD.STATS}`
    const headers = await this.getAuthHeaders()
    
    return this.makeRequest(url, {
      method: 'GET',
      headers,
    })
  }

  async getInteractionTrends() {
    const url = `${this.baseURL}${API_ENDPOINTS.DASHBOARD.TRENDS}`
    const headers = await this.getAuthHeaders()
    
    return this.makeRequest(url, {
      method: 'GET',
      headers,
    })
  }

  async getPersonalityEffectiveness() {
    const url = `${this.baseURL}${API_ENDPOINTS.DASHBOARD.PERSONALITY}`
    const headers = await this.getAuthHeaders()
    
    return this.makeRequest(url, {
      method: 'GET',
      headers,
    })
  }

  // Health check
  async healthCheck() {
    const url = `${this.baseURL}${API_ENDPOINTS.HEALTH}`
    const headers = await this.getAuthHeaders()
    
    return this.makeRequest(url, {
      method: 'GET',
      headers,
    })
  }

  // Cancel all pending requests
  cancelAllRequests() {
    this.requestQueue.forEach((promise, requestId) => {
      // In a real implementation, you'd cancel the actual requests
      this.requestQueue.delete(requestId)
    })
  }
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Create singleton instance
export const apiService = new ApiService()

export default apiService
