// src/services/api.js
// This file defines your API service functions.

import { callApi } from "../utils/api" // Import the new callApi utility

export const dashboardAPI = {
  getStats: async (token) => {
    // Pass the token to callApi
    return callApi("/dashboard/stats", "GET", undefined, token)
  },
  getInteractionTrends: async (token) => {
    // Pass the token to callApi
    return callApi("/dashboard/trends", "GET", undefined, token)
  },
  getPersonalityEffectiveness: async (token) => {
    // Pass the token to callApi
    return callApi("/dashboard/personality", "GET", undefined, token)
  },
  // Add other API calls here as needed
}

// Example for other APIs if you have them
export const userAPI = {
  getUsers: async (token) => {
    return callApi("/users", "GET", undefined, token)
  },
  // ... other user-related API calls
}

// You might also have an authAPI if you separated it
export const authAPI = {
  login: async (email, password) => {
    return callApi("/auth/login", "POST", { email, password })
  },
  register: async (name, email, password) => {
    return callApi("/auth/register", "POST", { name, email, password })
  },
}
