import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import {
  MessageSquare,
  Phone,
  Send,
  Bot,
  User,
  ChevronLeft,
  Settings as SettingsIcon,
  Zap,
} from "lucide-react-native"
import { THEME } from "../styles/globalStyles"
import GradientView from "../components/GradientView"
import CallInterface from "../components/CallInterface"
import { useAuth } from "../context/AuthContext"
import { apiService } from "../services/apiService"

const { width, height } = Dimensions.get("window")

const INDUSTRY_PRESETS = {
  general: { Empathy: 70, Assertiveness: 60, Humour: 50, Patience: 80, Confidence: 60 },
  finance: { Empathy: 60, Assertiveness: 80, Humour: 30, Patience: 70, Confidence: 90 },
  legal: { Empathy: 50, Assertiveness: 90, Humour: 10, Patience: 70, Confidence: 95 },
  realEstate: { Empathy: 80, Assertiveness: 70, Humour: 60, Patience: 75, Confidence: 80 },
  insurance: { Empathy: 75, Assertiveness: 75, Humour: 40, Patience: 80, Confidence: 85 },
}

const AVAILABLE_MODELS = [
  { label: "DeepSeek R1", value: "deepseek-r1" },
  { label: "BERT Base Uncased", value: "bert-base-uncased" },
  { label: "BERT Large Uncased", value: "bert-large-uncased" },
  { label: "GPT-4 Turbo", value: "gpt-4-turbo" },
]

const BotInteractionScreen = ({ navigation }) => {
  const { token } = useAuth()
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].value)
  const [selectedIndustry, setSelectedIndustry] = useState("general")
  const [personalitySettings, setPersonalitySettings] = useState(INDUSTRY_PRESETS.general)
  const [mode, setMode] = useState("chat") // 'chat' or 'call'
  const [showSettings, setShowSettings] = useState(false)
  const [botConfig, setBotConfig] = useState({
    enableVoice: false,
    enableTextToSpeech: false,
  })
  
  // Call states
  const [callStatus, setCallStatus] = useState("idle") // 'idle', 'connecting', 'ringing', 'in-progress', 'ended'
  const [callData, setCallData] = useState(null)
  
  const scrollViewRef = useRef(null)

  const sendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: currentMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageToSend = currentMessage
    setCurrentMessage("")
    setIsLoading(true)

    try {
      let result
      
      // Route to appropriate API based on selected model
      if (selectedModel === 'deepseek-r1') {
        result = await apiService.sendDeepSeekMessage(messageToSend, personalitySettings, {})
      } else if (selectedModel === 'gpt-4-turbo') {
        result = await apiService.sendOpenAIMessage(messageToSend, personalitySettings, {})
      } else {
        // BERT models
        result = await apiService.sendBERTMessage(messageToSend, personalitySettings, {}, selectedModel)
      }

      if (result && result.success) {
        const responseText = result.data?.response || result.data?.text || "Sorry, I couldn't process that."
        
        const botMessage = {
          id: Date.now() + 1,
          text: responseText,
          sender: "bot",
          timestamp: new Date(),
          model: result.data?.model || selectedModel,
        }

        setMessages((prev) => [...prev, botMessage])
      } else {
        throw new Error(result?.error || "Failed to get response")
      }
    } catch (error) {
      console.error("Bot API Error:", error)
      Alert.alert("Error", error.message || "Failed to get response from bot")
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  const handlePersonalityChange = (trait, value) => {
    setPersonalitySettings(prev => ({
      ...prev,
      [trait]: parseInt(value)
    }))
  }

  const handleIndustryChange = (industry) => {
    setSelectedIndustry(industry)
    setPersonalitySettings(INDUSTRY_PRESETS[industry])
  }

  // Call handler functions
  const handleInitiateCall = async (phoneNumber) => {
    if (!phoneNumber || !phoneNumber.trim()) {
      Alert.alert("Error", "Please enter a valid phone number")
      return
    }

    try {
      setCallStatus("connecting")
      
      const result = await apiService.startCall(
        phoneNumber,
        personalitySettings,
        {
          model: selectedModel,
          voiceType: "alloy",
        }
      )

      if (result && result.success) {
        setCallData({
          to: phoneNumber,
          from: "Your System",
          callSid: result.data?.callSid || null,
          direction: "outgoing",
        })
        setCallStatus("in-progress")
        
        Alert.alert("Success", "Call initiated successfully!")
      } else {
        throw new Error(result?.error || "Failed to initiate call")
      }
    } catch (error) {
      console.error("Call Error:", error)
      Alert.alert("Error", error.message || "Failed to initiate call")
      setCallStatus("idle")
    }
  }

  const handleAnswerCall = () => {
    if (callStatus === "ringing") {
      setCallStatus("in-progress")
      Alert.alert("Call Answered", "You are now connected")
    }
  }

  const handleEndCall = async () => {
    try {
      await apiService.endCall()
      setCallStatus("ended")
      
      setTimeout(() => {
        setCallStatus("idle")
        setCallData(null)
      }, 2000)
      
      Alert.alert("Call Ended", "The call has been disconnected")
    } catch (error) {
      console.error("End Call Error:", error)
      setCallStatus("idle")
      setCallData(null)
    }
  }

  const renderMessage = (message) => {
    const isBot = message.sender === "bot"
    
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isBot ? styles.botMessageContainer : styles.userMessageContainer,
        ]}
      >
        <View style={[styles.messageIcon, isBot ? styles.botIcon : styles.userIcon]}>
          {isBot ? <Bot size={16} color="white" /> : <User size={16} color="white" />}
        </View>
        <View style={[styles.messageBubble, isBot ? styles.botBubble : styles.userBubble]}>
          <Text style={[styles.messageText, isBot ? styles.botText : styles.userText]}>
            {message.text}
          </Text>
        </View>
      </View>
    )
  }

  const renderSettingsPanel = () => (
    <ScrollView style={styles.settingsPanel} contentContainerStyle={styles.settingsPanelContent}>
      {/* Model Selection - Chat Mode Only */}
      {mode === "chat" && (
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <SettingsIcon size={20} color="white" />
            <Text style={styles.settingTitle}>Model Selection</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedModel}
              onValueChange={setSelectedModel}
              style={styles.picker}
              dropdownIconColor="white"
            >
              {AVAILABLE_MODELS.map((model) => (
                <Picker.Item key={model.value} label={model.label} value={model.value} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {/* Industry Preset */}
      <View style={styles.settingCard}>
        <Text style={styles.settingTitle}>Industry Preset</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedIndustry}
            onValueChange={handleIndustryChange}
            style={styles.picker}
            dropdownIconColor="white"
          >
            <Picker.Item label="General" value="general" />
            <Picker.Item label="Finance" value="finance" />
            <Picker.Item label="Legal" value="legal" />
            <Picker.Item label="Real Estate" value="realEstate" />
            <Picker.Item label="Insurance" value="insurance" />
          </Picker>
        </View>
      </View>

      {/* Personality Settings */}
      <View style={styles.settingCard}>
        <Text style={styles.settingTitle}>Personality Settings</Text>
        {Object.entries(personalitySettings).map(([trait, value]) => (
          <View key={trait} style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>{trait}</Text>
              <Text style={styles.sliderValue}>{value}%</Text>
            </View>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${value}%` }]} />
              <View style={[styles.sliderThumb, { left: `${value}%` }]} />
            </View>
            <TextInput
              style={styles.hiddenSlider}
              value={value.toString()}
              onChangeText={(val) => handlePersonalityChange(trait, val)}
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>

      {/* Bot Configuration */}
      <View style={styles.settingCard}>
        <View style={styles.settingHeader}>
          <Zap size={20} color="white" />
          <Text style={styles.settingTitle}>Bot Configuration</Text>
        </View>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setBotConfig(prev => ({ ...prev, enableVoice: !prev.enableVoice }))}
        >
          <View style={[styles.checkbox, botConfig.enableVoice && styles.checkboxChecked]}>
            {botConfig.enableVoice && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Enable Voice Input</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setBotConfig(prev => ({ ...prev, enableTextToSpeech: !prev.enableTextToSpeech }))}
        >
          <View style={[styles.checkbox, botConfig.enableTextToSpeech && styles.checkboxChecked]}>
            {botConfig.enableTextToSpeech && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Enable Text-to-Speech</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
      <GradientView colors={[THEME.primary, THEME.secondary]} style={styles.backgroundGradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bot Interaction</Text>
          <TouchableOpacity onPress={() => setShowSettings(!showSettings)} style={styles.settingsToggle}>
            <SettingsIcon size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeToggleContainer}>
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeButton, mode === "chat" && styles.activeModeButton]}
              onPress={() => setMode("chat")}
            >
              <MessageSquare size={18} color="white" />
              <Text style={styles.modeButtonText}>Chat Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === "call" && styles.activeModeButton]}
              onPress={() => setMode("call")}
            >
              <Phone size={18} color="white" />
              <Text style={styles.modeButtonText}>Call Mode</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content Area - Two Column Layout like Web */}
        <View style={styles.mainContent}>
          {/* Settings Panel - Left Side (like web) */}
          {showSettings && renderSettingsPanel()}

          {/* Chat/Call Area - Right Side (like web) */}
          <View style={styles.interactionArea}>
            {mode === "chat" ? (
              <View style={styles.chatContainer}>
                {/* Chat Messages */}
                <ScrollView
                  ref={scrollViewRef}
                  style={styles.chatArea}
                  contentContainerStyle={styles.chatContent}
                >
                  {messages.length === 0 ? (
                    <View style={styles.emptyChat}>
                      <Bot size={64} color="rgba(255,255,255,0.3)" />
                      <Text style={styles.emptyText}>Start a conversation with the AI</Text>
                    </View>
                  ) : (
                    messages.map(renderMessage)
                  )}
                  {isLoading && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="white" />
                      <Text style={styles.loadingText}>AI is typing...</Text>
                    </View>
                  )}
                </ScrollView>

                {/* Input Bar */}
                <View style={styles.inputBar}>
                  <TextInput
                    style={styles.input}
                    value={currentMessage}
                    onChangeText={setCurrentMessage}
                    placeholder="Type your message..."
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    multiline
                    maxLength={500}
                  />
                  <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={isLoading || !currentMessage.trim()}>
                    <Send size={22} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* Call Interface */
              <View style={styles.callContainer}>
                <CallInterface
                  callStatus={callStatus}
                  callData={callData}
                  onInitiateCall={handleInitiateCall}
                  onAnswerCall={handleAnswerCall}
                  onEndCall={handleEndCall}
                  personalitySettings={personalitySettings}
                  disabled={isLoading}
                />
              </View>
            )}
          </View>
        </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
  },
  settingsToggle: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  modeToggleContainer: {
    alignItems: "center",
    paddingVertical: 15,
  },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  modeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 2,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  activeModeButton: {
    backgroundColor: "white",
  },
  modeButtonText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
  },
  settingsPanel: {
    width: width * 0.35,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.2)",
  },
  settingsPanelContent: {
    padding: 15,
  },
  settingCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 8,
  },
  pickerContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },
  picker: {
    color: "white",
    height: 50,
  },
  sliderContainer: {
    marginBottom: 15,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sliderLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  sliderValue: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
  },
  sliderTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    position: "relative",
  },
  sliderFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: THEME.accent1,
    borderRadius: 4,
  },
  sliderThumb: {
    position: "absolute",
    top: -4,
    width: 16,
    height: 16,
    backgroundColor: "white",
    borderRadius: 8,
    marginLeft: -8,
  },
  hiddenSlider: {
    position: "absolute",
    opacity: 0,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 4,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: THEME.accent1,
    borderColor: THEME.accent1,
  },
  checkmark: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  checkboxLabel: {
    color: "white",
    fontSize: 14,
  },
  interactionArea: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    margin: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 15,
  },
  chatContent: {
    paddingVertical: 20,
  },
  emptyChat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.15,
  },
  emptyText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 16,
    marginTop: 15,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-end",
  },
  botMessageContainer: {
    justifyContent: "flex-start",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
    flexDirection: "row-reverse",
  },
  messageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  botIcon: {
    backgroundColor: THEME.accent1,
    marginRight: 10,
  },
  userIcon: {
    backgroundColor: THEME.accent2,
    marginLeft: 10,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 15,
  },
  botBubble: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderBottomLeftRadius: 5,
  },
  userBubble: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderBottomRightRadius: 5,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: "white",
  },
  botText: {
    color: "white",
  },
  userText: {
    color: "white",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  loadingText: {
    color: "rgba(255,255,255,0.7)",
    fontStyle: "italic",
    marginLeft: 10,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: "white",
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: THEME.accent1,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  callContainer: {
    flex: 1,
    padding: 15,
  },
})

export default BotInteractionScreen

