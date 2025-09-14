"use client"

import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing token on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const existingToken = await AsyncStorage.getItem("userToken")
        const existingUser = await AsyncStorage.getItem("userData")

        if (existingToken && existingUser) {
          // Validate token with backend before setting it
          const isValid = await validateToken(existingToken)

          if (isValid) {
            setToken(existingToken)
            setUser(JSON.parse(existingUser))
            console.log("🔄 Valid token found, user logged in")
          } else {
            // Token is invalid, clear it
            await AsyncStorage.removeItem("userToken")
            await AsyncStorage.removeItem("userData")
            console.log("🔒 Invalid token removed, user needs to login")
          }
        } else {
          console.log("🔓 No token found, user needs to login")
        }
      } catch (e) {
        console.error("Failed to initialize auth:", e)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Validate token with backend
  const validateToken = async (token) => {
    try {
      const response = await fetch("http://192.168.10.3:5000/api/auth/validate", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch (error) {
      console.error("Token validation failed:", error)
      return false
    }
  }

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true)

      console.log("🔐 Attempting login with:", email)

      const response = await fetch("http://192.168.10.3:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.token) {
        // Store real token and user data
        await AsyncStorage.setItem("userToken", data.token)
        await AsyncStorage.setItem("userData", JSON.stringify(data.user))

        setToken(data.token)
        setUser(data.user)

        console.log("✅ Login successful!")
        return { success: true }
      } else {
        console.error("❌ Login failed:", data.message)
        return { success: false, error: data.message || "Login failed" }
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      return { success: false, error: "Network error. Please check your connection." }
    } finally {
      setIsLoading(false)
    }
  }

  // Registration function
  const register = async (name, email, password) => {
    try {
      setIsLoading(true)

      console.log("📝 Attempting registration with:", email)

      const response = await fetch("http://192.168.10.3:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok && data.token) {
        // Store token and user data after successful registration
        await AsyncStorage.setItem("userToken", data.token)
        await AsyncStorage.setItem("userData", JSON.stringify(data.user))

        setToken(data.token)
        setUser(data.user)

        console.log("✅ Registration successful!")
        return { success: true }
      } else {
        console.error("❌ Registration failed:", data.message)
        return { success: false, error: data.message || "Registration failed" }
      }
    } catch (error) {
      console.error("❌ Registration error:", error)
      return { success: false, error: "Network error. Please check your connection." }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken")
      await AsyncStorage.removeItem("userData")
      setToken(null)
      setUser(null)
      console.log("🔒 Logged out successfully.")
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
