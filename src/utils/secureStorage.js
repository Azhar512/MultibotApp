import AsyncStorage from '@react-native-async-storage/async-storage'

// Simple secure storage implementation using AsyncStorage
// In production, you might want to use react-native-keychain for better security
class SecureStorage {
  constructor() {
    this.prefix = 'secure_'
  }

  async setItem(key, value) {
    try {
      const secureKey = this.prefix + key
      await AsyncStorage.setItem(secureKey, value)
      return true
    } catch (error) {
      console.error('SecureStorage setItem error:', error)
      return false
    }
  }

  async getItem(key) {
    try {
      const secureKey = this.prefix + key
      const value = await AsyncStorage.getItem(secureKey)
      return value
    } catch (error) {
      console.error('SecureStorage getItem error:', error)
      return null
    }
  }

  async removeItem(key) {
    try {
      const secureKey = this.prefix + key
      await AsyncStorage.removeItem(secureKey)
      return true
    } catch (error) {
      console.error('SecureStorage removeItem error:', error)
      return false
    }
  }

  async clear() {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const secureKeys = keys.filter(key => key.startsWith(this.prefix))
      await AsyncStorage.multiRemove(secureKeys)
      return true
    } catch (error) {
      console.error('SecureStorage clear error:', error)
      return false
    }
  }
}

export const secureStorage = new SecureStorage()
export default secureStorage