import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useAuth } from "../context/AuthContext"
import { validateLoginForm, validateRegistrationForm } from "../utils/validation"
import { getAccessibilityProps } from "../utils/accessibility"

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const { login, register, isLoading } = useAuth()

  console.log("🔍 AuthScreen rendered, isLogin:", isLogin)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = () => {
    if (isLogin) {
      const validation = validateLoginForm({ email: formData.email, password: formData.password })
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0]
        Alert.alert("Error", firstError)
        return false
      }
    } else {
      const validation = validateRegistrationForm(formData)
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0]
        Alert.alert("Error", firstError)
        return false
      }
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    const { name, email, password } = formData

    let result
    if (isLogin) {
      result = await login(email, password)
    } else {
      result = await register(name, email, password)
    }

    if (!result.success) {
      Alert.alert(isLogin ? "Login Failed" : "Registration Failed", result.error)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text style={styles.title}>{isLogin ? "Welcome Back" : "Create Account"}</Text>
          <Text style={styles.subtitle}>{isLogin ? "Sign in to your account" : "Join us today"}</Text>

          <View style={styles.form}>
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
                autoCapitalize="words"
                editable={!isLoading}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              {...getAccessibilityProps('textInput', {
                accessibilityLabel: 'Email address',
                accessibilityHint: 'Enter your email address',
              })}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry
              editable={!isLoading}
              {...getAccessibilityProps('textInput', {
                accessibilityLabel: 'Password',
                accessibilityHint: 'Enter your password',
              })}
            />

            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange("confirmPassword", value)}
                secureTextEntry
                editable={!isLoading}
              />
            )}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              {...getAccessibilityProps('button', {
                accessibilityLabel: isLogin ? 'Sign in to your account' : 'Create new account',
                accessibilityHint: 'Double tap to submit the form',
              })}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{isLogin ? "Sign In" : "Create Account"}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>{isLogin ? "Don't have an account? " : "Already have an account? "}</Text>
              <TouchableOpacity onPress={toggleMode} disabled={isLoading}>
                <Text style={styles.switchLink}>{isLogin ? "Sign Up" : "Sign In"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.hint}>
            {isLogin ? "Enter your credentials to continue" : "Create a new account to get started"}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#667eea",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    minHeight: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    opacity: 0.9,
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#667eea",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  switchText: {
    color: "#666",
    fontSize: 14,
  },
  switchLink: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "bold",
  },
  hint: {
    textAlign: "center",
    color: "#fff",
    marginTop: 20,
    opacity: 0.8,
    fontSize: 14,
  },
})

export default AuthScreen
