// src/services/authservice.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { callApi } from '../utils/api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await callApi('/auth/login', 'POST', { email, password });
      
      if (response.token) {
        // Store the token locally
        await AsyncStorage.setItem('userToken', response.token);
        return { success: true, token: response.token };
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await callApi('/auth/register', 'POST', { name, email, password });
      
      if (response.token) {
        // Store the token locally
        await AsyncStorage.setItem('userToken', response.token);
        return { success: true, token: response.token };
      }
      
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getToken: async () => {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  },

  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }
};