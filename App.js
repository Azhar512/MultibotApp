"use client"

import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { ActivityIndicator, View, StyleSheet, Text } from "react-native"

import { AuthProvider, useAuth } from "./src/context/AuthContext"

// Import your screens
import DashboardScreen from "./src/screens/DashboardScreen"
import AuthScreen from "./src/screens/AuthScreen"
import BotInteractionScreen from "./src/screens/BotInteractionScreen"
import EmbedOptionsScreen from "./src/screens/EmbedOptionsScreen"
import InteractionLogScreen from "./src/screens/InteractionLogScreen"
import PersonalitySettingsScreen from "./src/screens/PersonalitySettingsScreen"
import ScenarioPanelScreen from "./src/screens/ScenarioPanelScreen"
import SettingsScreen from "./src/screens/SettingsScreen"
import UsersScreen from "./src/screens/UsersScreen"

const Stack = createStackNavigator()

// Loading component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#667eea" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
)

// Navigation component that uses auth context
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth()

  console.log("🔍 Auth State:", { isAuthenticated, isLoading })

  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Authenticated screens
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen
              name="BotInteraction"
              component={BotInteractionScreen}
              options={{
                headerShown: true,
                title: "Bot Interaction",
                headerStyle: { backgroundColor: "#667eea" },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="EmbedOptions"
              component={EmbedOptionsScreen}
              options={{
                headerShown: true,
                title: "Embed Options",
                headerStyle: { backgroundColor: "#667eea" },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="InteractionLog"
              component={InteractionLogScreen}
              options={{
                headerShown: true,
                title: "Interaction Log",
                headerStyle: { backgroundColor: "#667eea" },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="PersonalitySettings"
              component={PersonalitySettingsScreen}
              options={{
                headerShown: true,
                title: "Personality Settings",
                headerStyle: { backgroundColor: "#667eea" },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="ScenarioPanel"
              component={ScenarioPanelScreen}
              options={{
                headerShown: true,
                title: "Scenario Panel",
                headerStyle: { backgroundColor: "#667eea" },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                headerShown: true,
                title: "Settings",
                headerStyle: { backgroundColor: "#667eea" },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="Users"
              component={UsersScreen}
              options={{
                headerShown: true,
                title: "Users Management",
                headerStyle: { backgroundColor: "#667eea" },
                headerTintColor: "#fff",
              }}
            />
          </>
        ) : (
          // Non-authenticated screens - This should show the login/register screen
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// Main App component
function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
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
