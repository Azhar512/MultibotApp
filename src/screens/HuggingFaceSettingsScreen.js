import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native'
import { Bot, Key, TestTube, CheckCircle, XCircle } from 'lucide-react-native'
import GradientView from '../components/GradientView'
import { THEME } from '../styles/globalStyles'
import { botAPI } from '../services/botService'

const HuggingFaceSettingsScreen = ({ navigation }) => {
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [availableModels, setAvailableModels] = useState([])

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // Load available models
      const models = botAPI.getAvailableModels()
      setAvailableModels(models)
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter a valid API key')
      return
    }

    setIsLoading(true)
    try {
      const success = await botAPI.setHuggingFaceApiKey(apiKey.trim())
      
      if (success) {
        Alert.alert('Success', 'API key saved successfully!')
        setConnectionStatus({ type: 'saved', message: 'API key saved' })
      } else {
        Alert.alert('Error', 'Failed to save API key')
      }
    } catch (error) {
      Alert.alert('Error', `Failed to save API key: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key first')
      return
    }

    setIsLoading(true)
    setConnectionStatus({ type: 'testing', message: 'Testing connection...' })

    try {
      // Save the API key first
      await botAPI.setHuggingFaceApiKey(apiKey.trim())
      
      // Test the connection
      const result = await botAPI.testHuggingFaceConnection()
      
      if (result.success) {
        setConnectionStatus({ 
          type: 'success', 
          message: `Connection successful! Response: ${result.response}` 
        })
        Alert.alert('Success', 'HuggingFace API connection is working!')
      } else {
        setConnectionStatus({ 
          type: 'error', 
          message: `Connection failed: ${result.error}` 
        })
        Alert.alert('Error', `Connection failed: ${result.error}`)
      }
    } catch (error) {
      setConnectionStatus({ 
        type: 'error', 
        message: `Test failed: ${error.message}` 
      })
      Alert.alert('Error', `Test failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStatusIcon = () => {
    if (!connectionStatus) return null

    switch (connectionStatus.type) {
      case 'testing':
        return <TestTube size={20} color="#FFA500" />
      case 'success':
        return <CheckCircle size={20} color="#10B981" />
      case 'error':
        return <XCircle size={20} color="#EF4444" />
      case 'saved':
        return <CheckCircle size={20} color="#3B82F6" />
      default:
        return null
    }
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8A9B" />
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HuggingFace Settings</Text>
        <View style={styles.headerRight} />
      </View>
    </View>
  )

  const renderApiKeySection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>API Configuration</Text>
      
      <View style={styles.inputContainer}>
        <View style={styles.inputLabelContainer}>
          <Key size={16} color="white" />
          <Text style={styles.inputLabel}>HuggingFace API Key</Text>
        </View>
        <TextInput
          style={styles.textInput}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Enter your HuggingFace API key..."
          placeholderTextColor="rgba(255,255,255,0.6)"
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSaveApiKey}
          disabled={isLoading || !apiKey.trim()}
        >
          <GradientView colors={[THEME.primary, THEME.secondary]} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Save API Key</Text>
          </GradientView>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.testButton]}
          onPress={handleTestConnection}
          disabled={isLoading || !apiKey.trim()}
        >
          <GradientView colors={["#10B981", "#059669"]} style={styles.buttonGradient}>
            <TestTube size={16} color="white" />
            <Text style={styles.buttonText}>Test Connection</Text>
          </GradientView>
        </TouchableOpacity>
      </View>

      {connectionStatus && (
        <View style={styles.statusContainer}>
          <View style={styles.statusContent}>
            {renderStatusIcon()}
            <Text style={[
              styles.statusText,
              connectionStatus.type === 'success' && styles.successText,
              connectionStatus.type === 'error' && styles.errorText,
              connectionStatus.type === 'testing' && styles.testingText
            ]}>
              {connectionStatus.message}
            </Text>
          </View>
        </View>
      )}
    </View>
  )

  const renderModelsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Available Models</Text>
      <Text style={styles.sectionDescription}>
        These are the HuggingFace models available for use in your chatbot.
      </Text>
      
      {availableModels.map((model, index) => (
        <View key={index} style={styles.modelItem}>
          <View style={styles.modelHeader}>
            <Bot size={16} color="white" />
            <Text style={styles.modelName}>{model.name}</Text>
          </View>
          <Text style={styles.modelDescription}>{model.description}</Text>
          <Text style={styles.modelId}>ID: {model.id}</Text>
        </View>
      ))}
    </View>
  )

  const renderInstructions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>How to Get Your API Key</Text>
      
      <View style={styles.instructionItem}>
        <Text style={styles.instructionNumber}>1.</Text>
        <Text style={styles.instructionText}>
          Go to <Text style={styles.linkText}>huggingface.co</Text> and create an account
        </Text>
      </View>
      
      <View style={styles.instructionItem}>
        <Text style={styles.instructionNumber}>2.</Text>
        <Text style={styles.instructionText}>
          Navigate to your profile settings
        </Text>
      </View>
      
      <View style={styles.instructionItem}>
        <Text style={styles.instructionNumber}>3.</Text>
        <Text style={styles.instructionText}>
          Go to "Access Tokens" section
        </Text>
      </View>
      
      <View style={styles.instructionItem}>
        <Text style={styles.instructionNumber}>4.</Text>
        <Text style={styles.instructionText}>
          Create a new token with "Read" permissions
        </Text>
      </View>
      
      <View style={styles.instructionItem}>
        <Text style={styles.instructionNumber}>5.</Text>
        <Text style={styles.instructionText}>
          Copy the token and paste it above
        </Text>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <GradientView colors={["#FF8A9B", "#FF9A9A"]} style={styles.backgroundGradient}>
        {renderHeader()}
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderApiKeySection()}
          {renderModelsSection()}
          {renderInstructions()}
        </ScrollView>
      </GradientView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 60, // Same width as back button for centering
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 15,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  inputLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    // Additional styles if needed
  },
  testButton: {
    // Additional styles if needed
  },
  statusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
  successText: {
    color: '#10B981',
  },
  errorText: {
    color: '#EF4444',
  },
  testingText: {
    color: '#FFA500',
  },
  modelItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  modelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 8,
  },
  modelName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modelDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 5,
  },
  modelId: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    color: THEME.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: 20,
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  linkText: {
    color: THEME.primary,
    fontWeight: '600',
  },
})

export default HuggingFaceSettingsScreen
