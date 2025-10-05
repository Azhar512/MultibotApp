import AsyncStorage from '@react-native-async-storage/async-storage'
import CryptoJS from 'crypto-js'

// Encryption key - in production, this should be generated securely
const ENCRYPTION_KEY = 'your-secure-encryption-key-here'

// Secure storage utilities with encryption
export const secureStorage = {
  // Encrypt data before storing
  encrypt: (data) => {
    try {
      const jsonString = JSON.stringify(data)
      return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString()
    } catch (error) {
      console.error('Encryption failed:', error)
      return null
    }
  },

  // Decrypt data after retrieving
  decrypt: (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(decryptedString)
    } catch (error) {
      console.error('Decryption failed:', error)
      return null
    }
  },

  // Store encrypted data
  setItem: async (key, value) => {
    try {
      const encryptedValue = secureStorage.encrypt(value)
      if (encryptedValue) {
        await AsyncStorage.setItem(key, encryptedValue)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to store encrypted data:', error)
      return false
    }
  },

  // Retrieve and decrypt data
  getItem: async (key) => {
    try {
      const encryptedValue = await AsyncStorage.getItem(key)
      if (encryptedValue) {
        return secureStorage.decrypt(encryptedValue)
      }
      return null
    } catch (error) {
      console.error('Failed to retrieve encrypted data:', error)
      return null
    }
  },

  // Remove item
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Failed to remove item:', error)
      return false
    }
  },

  // Clear all data
  clear: async () => {
    try {
      await AsyncStorage.clear()
      return true
    } catch (error) {
      console.error('Failed to clear storage:', error)
      return false
    }
  }
}

// User token management
export const storeUserToken = async (token) => {
  return await secureStorage.setItem('userToken', token)
}

export const getUserToken = async () => {
  return await secureStorage.getItem('userToken')
}

export const removeUserToken = async () => {
  return await secureStorage.removeItem('userToken')
}

// User data management
export const storeUserData = async (userData) => {
  return await secureStorage.setItem('userData', userData)
}

export const getUserData = async () => {
  return await secureStorage.getItem('userData')
}

export const removeUserData = async () => {
  return await secureStorage.removeItem('userData')
}

// Session management
export const storeSessionData = async (sessionData) => {
  return await secureStorage.setItem('sessionData', sessionData)
}

export const getSessionData = async () => {
  return await secureStorage.getItem('sessionData')
}

export const removeSessionData = async () => {
  return await secureStorage.removeItem('sessionData')
}

// Settings management
export const storeSettings = async (settings) => {
  return await secureStorage.setItem('appSettings', settings)
}

export const getSettings = async () => {
  return await secureStorage.getItem('appSettings')
}

export const removeSettings = async () => {
  return await secureStorage.removeItem('appSettings')
}

// Cache management
export const storeCacheData = async (key, data, ttl = 3600000) => { // 1 hour default TTL
  const cacheItem = {
    data,
    timestamp: Date.now(),
    ttl
  }
  return await secureStorage.setItem(`cache_${key}`, cacheItem)
}

export const getCacheData = async (key) => {
  const cacheItem = await secureStorage.getItem(`cache_${key}`)
  if (!cacheItem) return null

  const now = Date.now()
  if (now - cacheItem.timestamp > cacheItem.ttl) {
    // Cache expired
    await secureStorage.removeItem(`cache_${key}`)
    return null
  }

  return cacheItem.data
}

export const removeCacheData = async (key) => {
  return await secureStorage.removeItem(`cache_${key}`)
}

// Clear all user-related data
export const clearUserData = async () => {
  try {
    await removeUserToken()
    await removeUserData()
    await removeSessionData()
    return true
  } catch (error) {
    console.error('Failed to clear user data:', error)
    return false
  }
}

export default secureStorage
