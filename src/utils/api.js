// Change this line to use the correct IP from your server console
const BASE_BACKEND_URL = "http://192.168.10.3:5000/api"

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