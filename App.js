import "react-native-gesture-handler"
import { ActivityIndicator, View, StyleSheet, Text } from "react-native"

import { AuthProvider, useAuth } from "./src/context/AuthContext"
import ErrorBoundary from "./src/components/ErrorBoundary"
import AppNavigator from "./src/navigations/AppNavigator"

// Loading component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#667eea" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
)

// Main navigation wrapper
const NavigationWrapper = () => {
  const { isLoading } = useAuth()

  console.log("🔍 Auth State:", { isLoading })

  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen />
  }

  return <AppNavigator />
}

// Main App component
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavigationWrapper />
      </AuthProvider>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
})

export default App
