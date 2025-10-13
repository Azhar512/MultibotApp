import logger from './logger';

// Backend API base URL
const BASE_BACKEND_URL = "http://168.231.114.68:5000/api";

/**
 * Make API calls to the backend
 * @param {string} endpoint - API endpoint path
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} body - Request body
 * @param {string} token - Authentication token
 * @returns {Promise<object>} - Response data
 */
export const callApi = async (endpoint, method, body, token) => {
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const fullUrl = `${BASE_BACKEND_URL}${endpoint}`;
  const startTime = Date.now();
  
  try {
    logger.api(method, fullUrl, body);
    
    const response = await fetch(fullUrl, config);
    const duration = Date.now() - startTime;
    
    const data = await response.json();
    logger.apiResponse(response.status, fullUrl, data);
    logger.performance(`API call ${method} ${endpoint}`, duration);

    if (!response.ok) {
      const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error("API call failed:", {
      endpoint: fullUrl,
      method,
      error: error.message,
      duration: `${duration}ms`
    });
    throw error;
  }
};