import 'react-native-gesture-handler'; // This MUST be first!
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import all your screens
import DashboardScreen from './src/screens/DashboardScreen';
import AuthScreen from './src/screens/AuthScreen';
import BotInteractionScreen from './src/screens/BotInteractionScreen';
import EmbedOptionsScreen from './src/screens/EmbedOptionsScreen';
import InteractionLogScreen from './src/screens/InteractionLogScreen';
import PersonalitySettingsScreen from './src/screens/PersonalitySettingsScreen';
import ScenarioPanelScreen from './src/screens/ScenarioPanelScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import UsersScreen from './src/screens/UsersScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ 
            title: 'AI Bot Analytics',
            headerShown: false // Hide header for dashboard since it has its own
          }}
        />
        
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen}
          options={{ title: 'Authentication' }}
        />
        
        <Stack.Screen 
          name="BotInteraction" 
          component={BotInteractionScreen}
          options={{ title: 'Bot Interaction' }}
        />
        
        <Stack.Screen 
          name="EmbedOptions" 
          component={EmbedOptionsScreen}
          options={{ title: 'Embed Options' }}
        />
        
        <Stack.Screen 
          name="InteractionLog" 
          component={InteractionLogScreen}
          options={{ title: 'Interaction Log' }}
        />
        
        <Stack.Screen 
          name="PersonalitySettings" 
          component={PersonalitySettingsScreen}
          options={{ title: 'Personality Settings' }}
        />
        
        <Stack.Screen 
          name="ScenarioPanel" 
          component={ScenarioPanelScreen}
          options={{ title: 'Scenario Panel' }}
        />
        
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
        
        <Stack.Screen 
          name="Users" 
          component={UsersScreen}
          options={{ title: 'Users Management' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;