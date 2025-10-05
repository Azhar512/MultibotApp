import { createContext, useState, useContext, useEffect } from "react"
import { secureStorage, storeUserToken, getUserToken, removeUserToken, storeUserData, getUserData, removeUserData } from "../utils/secureStorage"
import { apiService, ApiError } from "../services/apiService"
import { validateLoginForm, validateRegistrationForm } from "../utils/validation"

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing token on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const existingToken = await getUserToken()
        const existingUser = await getUserData()

        if (existingToken && existingUser) {
          // Validate token with backend before setting it
          const isValid = await validateToken(existingToken)

          if (isValid) {
            setToken(existingToken)
            setUser(existingUser)
            if (__DEV__) console.log("🔄 Valid token found, user logged in")
          } else {
            // Token is invalid, clear it
            await removeUserToken()
            await removeUserData()
            if (__DEV__) console.log("🔒 Invalid token removed, user needs to login")
          }
        } else {
          if (__DEV__) console.log("🔓 No token found, user needs to login")
        }
      } catch (e) {
        console.error("Failed to initialize auth:", e)
        // Clear potentially corrupted data
        await removeUserToken()
        await removeUserData()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Validate token with backend
  const validateToken = async (token) => {
    try {
      const result = await apiService.validateToken()
      return result.success
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("Token validation failed:", error.message)
      } else {
        console.error("Token validation error:", error)
      }
      return false
    }
  }

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true)

      // Validate input
      const validation = validateLoginForm({ email, password })
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0]
        return { success: false, error: firstError }
      }

      if (__DEV__) console.log("🔐 Attempting login with:", email)

      const result = await apiService.login(validation.data.email, validation.data.password)

      if (result.success && result.data.token) {
        // Store encrypted token and user data
        await storeUserToken(result.data.token)
        await storeUserData(result.data.user)

        setToken(result.data.token)
        setUser(result.data.user)

        if (__DEV__) console.log("✅ Login successful!")
        return { success: true }
      } else {
        const errorMessage = result.data?.message || "Login failed"
        if (__DEV__) console.error("❌ Login failed:", errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.data?.message || error.message || "Login failed"
        if (__DEV__) console.error("❌ Login error:", errorMessage)
        return { success: false, error: errorMessage }
      } else {
        if (__DEV__) console.error("❌ Login error:", error)
        return { success: false, error: "Network error. Please check your connection." }
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Registration function
  const register = async (name, email, password) => {
    try {
      setIsLoading(true)

      // Validate input
      const validation = validateRegistrationForm({ name, email, password })
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0]
        return { success: false, error: firstError }
      }

      if (__DEV__) console.log("📝 Attempting registration with:", email)

      const result = await apiService.register(validation.data.name, validation.data.email, validation.data.password)

      if (result.success && result.data.token) {
        // Store encrypted token and user data after successful registration
        await storeUserToken(result.data.token)
        await storeUserData(result.data.user)

        setToken(result.data.token)
        setUser(result.data.user)

        if (__DEV__) console.log("✅ Registration successful!")
        return { success: true }
      } else {
        const errorMessage = result.data?.message || "Registration failed"
        if (__DEV__) console.error("❌ Registration failed:", errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.data?.message || error.message || "Registration failed"
        if (__DEV__) console.error("❌ Registration error:", errorMessage)
        return { success: false, error: errorMessage }
      } else {
        if (__DEV__) console.error("❌ Registration error:", error)
        return { success: false, error: "Network error. Please check your connection." }
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await removeUserToken()
      await removeUserData()
      setToken(null)
      setUser(null)
      if (__DEV__) console.log("🔒 Logged out successfully.")
    } catch (e) {
      console.error("Failed to logout:", e)
    }
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        register,
        logout,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
