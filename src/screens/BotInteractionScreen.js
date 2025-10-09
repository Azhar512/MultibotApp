
import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Dimensions,
  StatusBar,
  Alert,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import {
  MessageSquare,
  Phone,
  Send,
  Bot,
  User,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Menu,
  Delete, // Change Backspace to Delete
} from "lucide-react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { THEME } from "../styles/globalStyles"
import GradientView from "../components/GradientView"
import Sidebar from "../components/Sidebar"

const { width, height } = Dimensions.get("window")

const INDUSTRY_PRESETS = {
  general: {
    Empathy: 70,
    Assertiveness: 60,
    Humour: 50,
    Patience: 80,
    Confidence: 60,
  },
  finance: {
    Empathy: 60,
    Assertiveness: 80,
    Humour: 30,
    Patience: 70,
    Confidence: 90,
  },
  legal: {
    Empathy: 50,
    Assertiveness: 90,
    Humour: 10,
    Patience: 70,
    Confidence: 95,
  },
  realEstate: {
    Empathy: 80,
    Assertiveness: 70,
    Humour: 60,
    Patience: 75,
    Confidence: 80,
  },
  insurance: {
    Empathy: 75,
    Assertiveness: 75,
    Humour: 40,
    Patience: 80,
    Confidence: 85,
  },
}

const AVAILABLE_MODELS = [
  { label: "DeepSeek R1", value: "deepseek-r1" },
  { label: "BERT Base Uncased", value: "bert-base-uncased" },
  { label: "BERT Large Uncased", value: "bert-large-uncased" },
  { label: "BERT Base Cased", value: "bert-base-cased" },
  { label: "BERT Large Cased", value: "bert-large-cased" },
  { label: "DistilBERT Base Uncased", value: "distilbert-base-uncased" },
  { label: "GPT-4 Turbo", value: "gpt-4-turbo" },
]

const VOICE_OPTIONS = [
  { label: "Alloy (Neutral)", value: "alloy" },
  { label: "Echo (Male)", value: "echo" },
  { label: "Nova (Female)", value: "nova" },
  { label: "Shimmer (Professional)", value: "shimmer" },
]

const BotInteractionScreen = ({ navigation }) => {
  // Navigation items for sidebar
  const navItems = [
    { icon: MessageSquare, label: "Dashboard", screen: "Dashboard" },
    { icon: Bot, label: "Bot Interaction", screen: "BotInteraction" },
    { icon: Phone, label: "Embed Options", screen: "EmbedOptions" },
    { icon: User, label: "Interaction Log", screen: "InteractionLog" },
    { icon: MessageSquare, label: "Personality Settings", screen: "PersonalitySettings" },
    { icon: Phone, label: "Scenario Panel", screen: "ScenarioPanel" },
    { icon: User, label: "Users", screen: "Users" },
    { icon: MessageSquare, label: "Settings", screen: "Settings" },
    { icon: Bot, label: "HuggingFace Settings", screen: "HuggingFaceSettings" },
  ]

  // State Management
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [apiStatus, setApiStatus] = useState({ isConnected: false, lastChecked: null })
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].value)
  const [selectedIndustry, setSelectedIndustry] = useState("general")
  const [personalitySettings, setPersonalitySettings] = useState(INDUSTRY_PRESETS.general)
  const [isRecording, setIsRecording] = useState(false)
  const [botConfig, setBotConfig] = useState({
    responseDelay: 1000,
    enableVoice: false,
    enableTextToSpeech: false,
    enableSentiment: false,
    language: "en-US",
  })

  // VoIP functionality states
  const [activeMode, setActiveMode] = useState("chat")
  const [callStatus, setCallStatus] = useState("idle") // idle, connecting, in-progress, ending
  const [callData, setCallData] = useState(null)
  const [selectedVoice, setSelectedVoice] = useState(VOICE_OPTIONS[0].value)

  // Dialer states
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showDialpad, setShowDialpad] = useState(true)
  const [twilioStatus, setTwilioStatus] = useState("Ready")
  const [huggingfaceStatus, setHuggingfaceStatus] = useState("Unknown")

  // Refs
  const scrollViewRef = useRef(null)

  const isDeepSeekModel = selectedModel === "deepseek-r1"
  const isOpenAIModel = selectedModel === "gpt-4-turbo"

  useEffect(() => {
    checkAuthAndConnection()
    initializeTwilio()
    checkHuggingFaceStatus()
  }, [])

  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")
      return token
    } catch (error) {
      console.error("Error getting auth token:", error)
      return null
    }
  }

  const checkAuthAndConnection = async () => {
    const token = await getAuthToken()
    if (!token) {
      setError("Please log in to use the chat interface.")
      setApiStatus({
        isConnected: false,
        lastChecked: new Date(),
        error: "Authentication required",
      })
    } else {
      checkApiConnection()
    }
  }

  const checkApiConnection = async () => {
    try {
      const token = await getAuthToken()
      const response = await fetch("http://168.231.114.68:5000/api/health", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        setApiStatus({
          isConnected: true,
          lastChecked: new Date(),
        })
      } else {
        throw new Error("API health check failed")
      }
    } catch (error) {
      setApiStatus({
        isConnected: false,
        lastChecked: new Date(),
        error: error.message,
      })
      setError("Unable to connect to API. Please check your connection and login status.")
    }
  }

  const initializeTwilio = async () => {
    try {
      const token = await getAuthToken()
      const response = await fetch("http://168.231.114.68:5000/api/twilio/token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setTwilioStatus("Ready")
      } else {
        setTwilioStatus("Error")
      }
    } catch (error) {
      console.error("Twilio initialization failed:", error)
      setTwilioStatus("Error")
    }
  }

  const checkHuggingFaceStatus = async () => {
    try {
      const botService = await import('../services/botService')
      const { botAPI } = botService
      const result = await botAPI.testHuggingFaceConnection()
      
      if (result.success) {
        setHuggingfaceStatus("Ready")
      } else {
        setHuggingfaceStatus("Error")
      }
    } catch (error) {
      console.error("HuggingFace status check failed:", error)
      setHuggingfaceStatus("Error")
    }
  }

  const handleIndustryChange = (industry) => {
    setSelectedIndustry(industry)
    setPersonalitySettings(INDUSTRY_PRESETS[industry])
  }

  const handlePersonalityChange = (trait, value) => {
    setPersonalitySettings((prev) => ({
      ...prev,
      [trait]: Math.max(0, Math.min(100, value)),
    }))
  }

  const handleModeChange = (mode) => {
    setActiveMode(mode)
  }

  // Dialer functions
  const handleDialpadPress = (digit) => {
    if (phoneNumber.length < 15) {
      setPhoneNumber((prev) => prev + digit)
    }
  }

  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1))
  }

  const formatPhoneNumber = (number) => {
    // Format as (XXX) XXX-XXXX
    const cleaned = number.replace(/\D/g, "")
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return number
  }

  const callBotAPI = async (text) => {
    const token = await getAuthToken()
    
    try {
      // Import the bot service
      const botService = await import('../services/botService')
      const { botAPI } = botService
      
      let result
      
      if (selectedModel === "deepseek-r1") {
        // Try backend first, then fallback
        try {
          const response = await fetch(`http://168.231.114.68:5000/api/bot/deepseek`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              message: text,
              personality: personalitySettings,
              config: botConfig,
            }),
          })
          
          if (response.ok) {
            result = await response.json()
          } else {
            throw new Error(`Backend API Error: ${response.status}`)
          }
        } catch (error) {
          console.warn('Backend DeepSeek API failed, using fallback:', error.message)
          // Fallback to HuggingFace
          result = await botAPI.sendMessage(text, personalitySettings, botConfig, token, 'microsoft/DialoGPT-large')
        }
      } else if (selectedModel === "gpt-4-turbo") {
        // Try backend first, then fallback
        try {
          const response = await fetch(`http://168.231.114.68:5000/api/bot/openai`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              message: text,
              personality: personalitySettings,
              config: botConfig,
              voiceType: selectedVoice,
            }),
          })
          
          if (response.ok) {
            result = await response.json()
          } else {
            throw new Error(`Backend API Error: ${response.status}`)
          }
        } catch (error) {
          console.warn('Backend OpenAI API failed, using fallback:', error.message)
          // Fallback to HuggingFace
          result = await botAPI.sendMessage(text, personalitySettings, botConfig, token, 'microsoft/DialoGPT-large')
        }
      } else {
        // Use BERT service with fallback
        result = await botAPI.sendBERTMessage(text, personalitySettings, botConfig, token, selectedModel)
      }

      // Handle the response format
      if (result.success) {
        return {
          response: result.data?.response || result.response,
          confidence: result.data?.confidence || result.confidence || 0.75,
          model: result.data?.model || result.model || selectedModel,
          timestamp: result.data?.timestamp || new Date().toISOString()
        }
      } else {
        throw new Error(result.error || 'Unknown API error')
      }
    } catch (error) {
      console.error('Bot API call failed:', error)
      throw error
    }
  }

  const handleMessageSubmit = async (text) => {
    if (!text || !text.trim()) {
      setError("Please enter a message")
      return
    }

    // Check if API is connected before attempting to send
    if (!apiStatus.isConnected) {
      setError("API connection is unavailable. Please check your connection and try again.")
      return
    }

    const newMessage = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setCurrentMessage("")
    setIsLoading(true)
    setError(null)

    try {
      const result = await callBotAPI(text)

      const botResponse = result.response || result.text || "I apologize, but I couldn't process your message."
      const confidence = result.confidence || 0.5
      const sentiment = result.sentiment || null

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        confidence,
        sentiment,
      }

      setMessages((prev) => [...prev, botMessage])
      setError(null)

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    } catch (error) {
      console.error("Bot response error:", error)
      setError(error.message || "Failed to get bot response. Please try again.")
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "I apologize, but I couldn't process your message. Please try again.",
          sender: "bot",
          timestamp: new Date(),
          isError: true,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCall = async (action, number = null) => {
    try {
      const token = await getAuthToken()

      switch (action) {
        case "start":
          if (!phoneNumber && !number) {
            Alert.alert("Error", "Please enter a phone number")
            return
          }

          setCallStatus("connecting")
          const response = await fetch("http://168.231.114.68:5000/api/twilio/initiate-call", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              phoneNumber: number || phoneNumber,
              personality: personalitySettings,
              config: botConfig,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            setCallStatus("in-progress")
            setCallData(data)
            Alert.alert("Call Started", `Calling ${formatPhoneNumber(number || phoneNumber)}`)
          } else {
            throw new Error("Failed to start call")
          }
          break

        case "end":
          setCallStatus("ending")
          await fetch("http://168.231.114.68:5000/api/twilio/end-call", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          setCallStatus("idle")
          setCallData(null)
          Alert.alert("Call Ended", "Call has been terminated")
          break
      }
    } catch (error) {
      console.error("Call error:", error)
      Alert.alert("Call Error", error.message)
      setCallStatus("idle")
    }
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8A9B" />
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarOpen(true)}>
          <Menu size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bot Interaction</Text>
        <View style={styles.headerRight}>
        </View>
      </View>
    </View>
  )

  const renderModeTabs = () => (
    <View style={styles.modeTabsContainer}>
      <View style={styles.modeTabs}>
        <TouchableOpacity
          style={[styles.modeTab, activeMode === "chat" && styles.activeModeTab]}
          onPress={() => handleModeChange("chat")}
        >
          <MessageSquare size={18} color={activeMode === "chat" ? "#FF8A9B" : "white"} />
          <Text style={[styles.modeTabText, activeMode === "chat" && styles.activeModeTabText]}>Chat Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeTab, activeMode === "call" && styles.activeModeTab]}
          onPress={() => handleModeChange("call")}
        >
          <Phone size={18} color={activeMode === "call" ? "#FF8A9B" : "white"} />
          <Text style={[styles.modeTabText, activeMode === "call" && styles.activeModeTabText]}>Call Mode</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderDialpad = () => {
    const dialpadNumbers = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      ["*", "0", "#"],
    ]

    return (
      <View style={styles.dialpadContainer}>
        {dialpadNumbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.dialpadRow}>
            {row.map((number) => (
              <TouchableOpacity key={number} style={styles.dialpadButton} onPress={() => handleDialpadPress(number)}>
                <Text style={styles.dialpadButtonText}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    )
  }

  const renderCallInterface = () => (
    <View style={styles.callCard}>
      {/* AI Call Assistant Header */}
      <View style={styles.callHeader}>
        <Text style={styles.callTitle}>AI Call Assistant</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: twilioStatus === "Ready" ? "#10B981" : "#EF4444" }]} />
          <Text style={styles.statusText}>{twilioStatus}</Text>
        </View>
      </View>

      {/* Phone Number Input */}
      <View style={styles.phoneInputContainer}>
        <TextInput
          style={styles.phoneInput}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter phone number..."
          placeholderTextColor="rgba(255,255,255,0.6)"
          keyboardType="phone-pad"
          maxLength={15}
          textContentType="telephoneNumber"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="done"
        />
        {phoneNumber.length > 0 && (
          <TouchableOpacity style={styles.backspaceButton} onPress={handleBackspace}>
  <Delete size={20} color="white" />
</TouchableOpacity>
        )}
      </View>

      {/* Hide/Show Dialpad Button */}
      <TouchableOpacity style={styles.dialpadToggle} onPress={() => setShowDialpad(!showDialpad)}>
        <Text style={styles.dialpadToggleText}>{showDialpad ? "# Hide Dialpad" : "# Show Dialpad"}</Text>
      </TouchableOpacity>

      {/* Dialpad */}
      {showDialpad && renderDialpad()}

      {/* Call Button */}
      <View style={styles.callButtonContainer}>
        {callStatus === "idle" && (
          <TouchableOpacity style={styles.callButton} onPress={() => handleCall("start")} disabled={!phoneNumber}>
            <GradientView colors={["#10B981", "#059669"]} style={styles.callButtonGradient}>
              <PhoneCall size={24} color="white" />
              <Text style={styles.callButtonText}>Call</Text>
            </GradientView>
          </TouchableOpacity>
        )}

        {(callStatus === "connecting" || callStatus === "in-progress") && (
          <TouchableOpacity style={styles.endCallButton} onPress={() => handleCall("end")}>
            <GradientView colors={["#EF4444", "#DC2626"]} style={styles.callButtonGradient}>
              <PhoneOff size={24} color="white" />
              <Text style={styles.callButtonText}>End Call</Text>
            </GradientView>
          </TouchableOpacity>
        )}
      </View>

      {/* Call Status */}
      {callStatus !== "idle" && (
        <View style={styles.callStatusContainer}>
          <Text style={styles.callStatusText}>
            Status:{" "}
            {callStatus === "connecting"
              ? "Connecting..."
              : callStatus === "in-progress"
                ? "In Progress"
                : callStatus === "ending"
                  ? "Ending..."
                  : "Idle"}
          </Text>
          {callData && <Text style={styles.callInfoText}>Calling: {formatPhoneNumber(phoneNumber)}</Text>}
        </View>
      )}
    </View>
  )

  const renderPersonalitySettings = () => (
    <View style={styles.settingsCard}>
      <Text style={styles.cardTitle}>Personality Settings</Text>

      {/* Industry Preset */}
      {!isDeepSeekModel && (
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Industry Preset</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={selectedIndustry} onValueChange={handleIndustryChange} style={styles.picker}>
              {Object.keys(INDUSTRY_PRESETS).map((industry) => (
                <Picker.Item
                  key={industry}
                  label={industry.charAt(0).toUpperCase() + industry.slice(1)}
                  value={industry}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {/* Personality Traits */}
      {Object.entries(personalitySettings).map(([trait, value]) => (
        <View key={trait} style={styles.personalityItem}>
          <View style={styles.personalityHeader}>
            <Text style={styles.personalityLabel}>{trait}</Text>
            <Text style={styles.personalityValue}>{value}%</Text>
          </View>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack}>
              <GradientView
                colors={[THEME.primary, THEME.secondary]}
                style={[styles.sliderFill, { width: `${value}%` }]}
              />
            </View>
            <View style={styles.sliderButtons}>
              <TouchableOpacity style={styles.sliderButton} onPress={() => handlePersonalityChange(trait, value - 10)}>
                <Text style={styles.sliderButtonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sliderButton} onPress={() => handlePersonalityChange(trait, value + 10)}>
                <Text style={styles.sliderButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  )

  const renderModelSettings = () =>
    activeMode === "chat" && (
      <View style={styles.settingsCard}>
        <Text style={styles.cardTitle}>Model Settings</Text>

        {/* Model Selection */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>AI Model</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={selectedModel} onValueChange={setSelectedModel} style={styles.picker}>
              {AVAILABLE_MODELS.map((model) => (
                <Picker.Item key={model.value} label={model.label} value={model.value} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Voice Selection for OpenAI */}
        {isOpenAIModel && (
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Voice Type</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={selectedVoice} onValueChange={setSelectedVoice} style={styles.picker}>
                {VOICE_OPTIONS.map((voice) => (
                  <Picker.Item key={voice.value} label={voice.label} value={voice.value} />
                ))}
              </Picker>
            </View>
          </View>
        )}
      </View>
    )

  const renderBotConfiguration = () => (
    <View style={styles.settingsCard}>
      <Text style={styles.cardTitle}>Bot Configuration</Text>

      <View style={styles.configItem}>
        <Text style={styles.configLabel}>Enable Voice Input</Text>
        <Switch
          value={botConfig.enableVoice}
          onValueChange={(value) => setBotConfig((prev) => ({ ...prev, enableVoice: value }))}
          trackColor={{ false: "#ccc", true: THEME.primary }}
          thumbColor="white"
        />
      </View>

      <View style={styles.configItem}>
        <Text style={styles.configLabel}>Enable Text-to-Speech</Text>
        <Switch
          value={botConfig.enableTextToSpeech}
          onValueChange={(value) => setBotConfig((prev) => ({ ...prev, enableTextToSpeech: value }))}
          trackColor={{ false: "#ccc", true: THEME.primary }}
          thumbColor="white"
        />
      </View>

      <View style={styles.configItem}>
        <Text style={styles.configLabel}>Sentiment Analysis</Text>
        <Switch
          value={botConfig.enableSentiment}
          onValueChange={(value) => setBotConfig((prev) => ({ ...prev, enableSentiment: value }))}
          trackColor={{ false: "#ccc", true: THEME.primary }}
          thumbColor="white"
        />
      </View>
    </View>
  )

  const renderChatInterface = () => (
    <View style={styles.chatCard}>
      <Text style={styles.cardTitle}>Chat Interface</Text>

      <ScrollView ref={scrollViewRef} style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === "user" ? styles.userMessageContainer : styles.botMessageContainer,
            ]}
          >
            {message.sender === "bot" && (
              <View style={styles.botAvatar}>
                <GradientView colors={[THEME.accent1, THEME.primary]} style={styles.avatarGradient}>
                  <Bot size={16} color="white" />
                </GradientView>
              </View>
            )}

            <View style={[styles.messageBubble, message.sender === "user" ? styles.userBubble : styles.botBubble]}>
              <Text style={[styles.messageText, message.sender === "user" ? styles.userText : styles.botText]}>
                {message.text}
              </Text>
              <Text style={styles.timestamp}>
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>

            {message.sender === "user" && (
              <View style={styles.userAvatar}>
                <GradientView colors={[THEME.accent2, THEME.primary]} style={styles.avatarGradient}>
                  <User size={16} color="white" />
                </GradientView>
              </View>
            )}
          </View>
        ))}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <View style={styles.botAvatar}>
              <GradientView colors={[THEME.accent1, THEME.primary]} style={styles.avatarGradient}>
                <Bot size={16} color="white" />
              </GradientView>
            </View>
            <View style={styles.loadingBubble}>
              <Text style={styles.loadingText}>Bot is typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          value={currentMessage}
          onChangeText={setCurrentMessage}
          placeholder={apiStatus.isConnected ? "Type your message..." : "Type your message... (API disconnected)"}
          placeholderTextColor="#999"
          editable={!isLoading}
          multiline
          maxLength={500}
          textContentType="none"
          autoCorrect={true}
          autoCapitalize="sentences"
          returnKeyType="default"
          blurOnSubmit={false}
        />

        {botConfig.enableVoice && (
          <TouchableOpacity
            style={[styles.voiceButton, isRecording && styles.recordingButton]}
            onPress={() => setIsRecording(!isRecording)}
            disabled={isLoading || !apiStatus.isConnected}
          >
            {isRecording ? <MicOff size={20} color="white" /> : <Mic size={20} color="white" />}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.sendButton, (!currentMessage.trim() || isLoading) && styles.disabledButton]}
          onPress={() => handleMessageSubmit(currentMessage)}
          disabled={!currentMessage.trim() || isLoading}
        >
          <GradientView colors={[THEME.primary, THEME.secondary]} style={styles.sendButtonGradient}>
            <Send size={20} color="white" />
          </GradientView>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <GradientView colors={["#FF8A9B", "#FF9A9A"]} style={styles.backgroundGradient}>
        {renderHeader()}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {!apiStatus.isConnected && (
            <View style={styles.apiAlert}>
              <Text style={styles.apiAlertText}>
                API connection is unavailable. Please check your connection and login status.
              </Text>
            </View>
          )}

          {/* HuggingFace Status */}
          <View style={styles.statusCard}>
            <Text style={styles.statusCardTitle}>Service Status</Text>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Backend API:</Text>
              <View style={styles.statusIndicator}>
                <View style={[
                  styles.statusDot, 
                  { backgroundColor: apiStatus.isConnected ? "#10B981" : "#EF4444" }
                ]} />
                <Text style={styles.statusText}>
                  {apiStatus.isConnected ? "Connected" : "Disconnected"}
                </Text>
              </View>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>HuggingFace:</Text>
              <View style={styles.statusIndicator}>
                <View style={[
                  styles.statusDot, 
                  { backgroundColor: huggingfaceStatus === "Ready" ? "#10B981" : "#EF4444" }
                ]} />
                <Text style={styles.statusText}>
                  {huggingfaceStatus === "Ready" ? "Ready" : "Not Configured"}
                </Text>
              </View>
            </View>
            {huggingfaceStatus !== "Ready" && (
              <TouchableOpacity 
                style={styles.configureButton}
                onPress={() => navigation.navigate('HuggingFaceSettings')}
              >
                <Text style={styles.configureButtonText}>Configure HuggingFace API</Text>
              </TouchableOpacity>
            )}
          </View>

          {renderModeTabs()}

          {/* Settings Section - Only show for chat mode */}
          {activeMode === "chat" && (
            <>
              {renderPersonalitySettings()}
              {renderModelSettings()}
              {renderBotConfiguration()}
            </>
          )}

          {/* Main Interface */}
          {activeMode === "chat" ? renderChatInterface() : renderCallInterface()}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </ScrollView>

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          navItems={navItems}
          navigation={navigation}
          currentScreen="BotInteraction"
        />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuButton: {
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  userText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  apiAlert: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  apiAlertText: {
    color: "#EF4444",
    fontSize: 14,
    textAlign: "center",
  },
  modeTabsContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  modeTabs: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 25,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  modeTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 120,
    justifyContent: "center",
  },
  activeModeTab: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  modeTabText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  activeModeTabText: {
    color: "#FF8A9B",
  },
  settingsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: "#333",
  },
  personalityItem: {
    marginBottom: 20,
  },
  personalityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  personalityLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  personalityValue: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    fontWeight: "600",
  },
  sliderContainer: {
    marginBottom: 10,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  sliderFill: {
    height: "100%",
    borderRadius: 4,
  },
  sliderButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  sliderButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  configItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  configLabel: {
    color: "white",
    fontSize: 16,
    flex: 1,
  },
  chatCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    minHeight: 450,
  },
  messagesContainer: {
    maxHeight: 350,
    marginBottom: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-end",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  botMessageContainer: {
    justifyContent: "flex-start",
  },
  botAvatar: {
    marginRight: 8,
  },
  userAvatar: {
    marginLeft: 8,
  },
  avatarGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  messageBubble: {
    maxWidth: width * 0.65,
    padding: 12,
    borderRadius: 18,
  },
  botBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: THEME.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  botText: {
    color: "#333",
  },
  userText: {
    color: "white",
  },
  timestamp: {
    fontSize: 10,
    color: "rgba(0,0,0,0.5)",
    marginTop: 4,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 15,
  },
  loadingBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  loadingText: {
    color: "#333",
    fontSize: 14,
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  messageInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    color: "#333",
  },
  voiceButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    padding: 12,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  recordingButton: {
    backgroundColor: "#EF4444",
  },
  sendButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  sendButtonGradient: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  // Call Interface Styles
  callCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    minHeight: 600,
  },
  callHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  callTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: "white",
    fontWeight: "500",
  },
  backspaceButton: {
    padding: 5,
  },
  dialpadToggle: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 25,
  },
  dialpadToggleText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dialpadContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  dialpadRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    gap: 15,
  },
  dialpadButton: {
    width: 70,
    height: 70,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  dialpadButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  callButtonContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  callButton: {
    borderRadius: 25,
    overflow: "hidden",
    width: "50%",
  },
  endCallButton: {
    borderRadius: 25,
    overflow: "hidden",
    width: "100%",
  },
  callButtonGradient: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 13,
  paddingHorizontal: 68,
  gap: 8, // Reduce gap for tighter spacing
  minHeight: 56, // Ensure consistent button height
},
callButtonText: {
  color: "white",
  fontSize: 18,
  fontWeight: "bold",
  textAlign: "center",
  includeFontPadding: false, // Remove extra font padding on Android
  textAlignVertical: "center", // Center text vertically on Android
},
  callStatusContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 15,
  },
  callStatusText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    
  },
  callInfoText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    textAlign: "center",
  },
  // Status Card Styles
  statusCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statusCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  configureButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
    alignItems: "center",
  },
  configureButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default BotInteractionScreen
