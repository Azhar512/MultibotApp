import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useAuth } from '../context/AuthContext'

// Import screens
import AuthScreen from '../screens/AuthScreen'
import DashboardScreen from '../screens/DashboardScreen'
import BotInteractionScreen from '../screens/BotInteractionScreen'
import EmbedOptionsScreen from '../screens/EmbedOptionsScreen'
import InteractionLogScreen from '../screens/InteractionLogScreen'
import PersonalitySettingsScreen from '../screens/PersonalitySettingsScreen'
import ScenarioPanelScreen from '../screens/ScenarioPanelScreen'
import SettingsScreen from '../screens/SettingsScreen'
import UsersScreen from '../screens/UsersScreen'
import HuggingFaceSettingsScreen from '../screens/HuggingFaceSettingsScreen'

const Stack = createStackNavigator()

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null // Loading is handled in App.js
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
            <Stack.Screen
              name="HuggingFaceSettings"
              component={HuggingFaceSettingsScreen}
              options={{
                headerShown: true,
                title: "HuggingFace Settings",
                headerStyle: { backgroundColor: "#667eea" },
                headerTintColor: "#fff",
              }}
            />
          </>
        ) : (
          // Non-authenticated screens
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
