// Updated to use your server IP
const BASE_BACKEND_URL = "http://168.231.114.68:5000/api"

export const callApi = async (endpoint, method, body, token) => {
  const headers = {
    "Content-Type": "application/json",
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const config = {
    method,
    headers,
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const fullUrl = `${BASE_BACKEND_URL}${endpoint}`;
  
  try {
    console.log(`🚀 Making API call to: ${fullUrl}`);
    console.log(`📋 Method: ${method}`);
    console.log(`📦 Body:`, body);
    
    const response = await fetch(fullUrl, config)
    console.log(`📡 Response status: ${response.status}`);
    
    const data = await response.json()
    console.log(`📄 Response data:`, data);

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error("❌ API call failed:", error)
    console.error("🔍 Error details:", error.message)
    throw error
  }
}