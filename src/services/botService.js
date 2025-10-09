// src/services/botService.js
// This file defines your bot service functions.

import { callApi } from "../utils/api" // Import the new callApi utility
import huggingfaceService from './huggingfaceService'

export const botAPI = {
  sendMessage: async (message, personality, config, token, model = 'microsoft/DialoGPT-medium') => {
    try {
      // First try the backend API
      const backendResponse = await callApi("/bot/chat", "POST", { message, personality, config }, token)
      
      if (backendResponse && backendResponse.success) {
        return backendResponse
      }
    } catch (error) {
      console.warn('Backend API failed, trying HuggingFace directly:', error.message)
    }

    // Fallback to direct HuggingFace API
    try {
      const huggingfaceResponse = await huggingfaceService.generateText(message, model, personality)
      
      return {
        success: true,
        data: {
          response: huggingfaceResponse.text,
          confidence: huggingfaceResponse.confidence,
          model: huggingfaceResponse.model,
          timestamp: huggingfaceResponse.timestamp
        }
      }
    } catch (error) {
      console.error('HuggingFace API failed:', error)
      return {
        success: false,
        error: error.message || 'Failed to get bot response'
      }
    }
  },

  sendBERTMessage: async (message, personality, config, token, model = 'bert-base-uncased') => {
    try {
      // Map BERT models to working HuggingFace models
      const modelMapping = {
        'bert-base-uncased': 'google/flan-t5-base',
        'bert-large-uncased': 'microsoft/DialoGPT-medium',
        'bert-base-cased': 'google/flan-t5-base',
        'bert-large-cased': 'microsoft/DialoGPT-large',
        'distilbert-base-uncased': 'distilgpt2'
      }

      const effectiveModel = modelMapping[model] || 'microsoft/DialoGPT-medium'
      
      // Try backend first
      const backendResponse = await callApi("/bot/bert", "POST", { 
        message, 
        personality, 
        config, 
        model 
      }, token)
      
      if (backendResponse && backendResponse.success) {
        return backendResponse
      }
    } catch (error) {
      console.warn('Backend BERT API failed, trying HuggingFace directly:', error.message)
    }

    // Fallback to direct HuggingFace API
    try {
      const huggingfaceResponse = await huggingfaceService.generateText(message, effectiveModel, personality)
      
      return {
        success: true,
        data: {
          response: huggingfaceResponse.text,
          confidence: huggingfaceResponse.confidence,
          model: model,
          effectiveModel: effectiveModel,
          timestamp: huggingfaceResponse.timestamp
        }
      }
    } catch (error) {
      console.error('HuggingFace BERT API failed:', error)
      return {
        success: false,
        error: error.message || 'Failed to get BERT response'
      }
    }
  },

  // Test HuggingFace connection
  testHuggingFaceConnection: async () => {
    try {
      const result = await huggingfaceService.testConnection()
      return result
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Get available models
  getAvailableModels: () => {
    return huggingfaceService.getAvailableModels()
  },

  // Set HuggingFace API key
  setHuggingFaceApiKey: async (apiKey) => {
    return await huggingfaceService.setApiKey(apiKey)
  }
}
