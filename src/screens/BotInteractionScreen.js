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
import {
  MessageSquare,
  Phone,
  Send,
  Bot,
  User,
  Menu,
  ChevronLeft,
  Minus,
  Plus,
} from "lucide-react-native"
import { THEME } from "../styles/globalStyles"
import GradientView from "../components/GradientView"
import Sidebar from "../components/Sidebar"
import { useAuth } from "../context/AuthContext"
import { apiService } from "../services/apiService"

const { width, height } = Dimensions.get("window")

const AVAILABLE_MODELS = [
  { label: "DeepSeek R1", value: "deepseek-r1" },
  { label: "BERT Base Uncased", value: "bert-base-uncased" },
  { label: "BERT Large Uncased", value: "bert-large-uncased" },
  { label: "GPT-4 Turbo", value: "gpt-4-turbo" },
]

const BotInteractionScreen = ({ navigation }) => {
  const { token } = useAuth()
  const [mode, setMode] = useState("chat") // 'chat' or 'call'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Chat states
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].value)
  
  // Personality states - matching your screenshot
  const [personalitySettings, setPersonalitySettings] = useState({
    Empathy: 100,
    Assertiveness: 60,
    Humour: 50,
    Patience: 80,
    Confidence: 60,
  })
  
  // Call states
  const [phoneNumber, setPhoneNumber] = useState("")
  const [callStatus, setCallStatus] = useState("idle")
  const [showDialpad, setShowDialpad] = useState(true)
  
  const scrollViewRef = useRef(null)

  const navItems = [
    { icon: MessageSquare, label: "Dashboard", screen: "Dashboard" },
    { icon: Bot, label: "Bot Interaction", screen: "BotInteraction" },
    { icon: Phone, label: "Embed Options", screen: "EmbedOptions" },
    { icon: User, label: "Users", screen: "Users" },
  ]

  // Adjust personality trait
  const adjustPersonality = (trait, delta) => {
    setPersonalitySettings(prev => ({
      ...prev,
      [trait]: Math.max(0, Math.min(100, prev[trait] + delta))
    }))
  }

  // Send message
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

      // Handle different response formats from different APIs
      if (result && (result.success !== false)) {
        // Extract response text from various possible formats
        const responseText = 
          result.data?.botResponse || 
          result.data?.response || 
          result.data?.text || 
          result.botResponse || 
          result.response || 
          result.text || 
          "Sorry, I couldn't process that."
        
        const botMessage = {
          id: Date.now() + 1,
          text: responseText,
          sender: "bot",
          timestamp: new Date(),
          model: result.data?.model || result.model || selectedModel,
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

  // Dial pad number input
  const handleDialpadPress = (digit) => {
    setPhoneNumber(prev => prev + digit)
  }

  // Delete last digit
  const handleBackspace = () => {
    setPhoneNumber(prev => prev.slice(0, -1))
  }

  // Initiate call
  const handleCall = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter a phone number")
      return
    }

    try {
      setCallStatus("connecting")
      const result = await apiService.startCall(phoneNumber, personalitySettings, {})
      
      if (result && result.success !== false) {
        setCallStatus("in-progress")
        Alert.alert("Success", "Call initiated!")
      } else {
        throw new Error(result?.error || "Failed to initiate call")
      }
    } catch (error) {
      console.error("Call Error:", error)
      Alert.alert("Error", error.message || "Failed to initiate call")
      setCallStatus("idle")
    }
  }

  // End call
  const handleEndCall = async () => {
    try {
      await apiService.endCall()
      setCallStatus("idle")
      setPhoneNumber("")
      Alert.alert("Call Ended", "The call has been disconnected")
    } catch (error) {
      console.error("End Call Error:", error)
      setCallStatus("idle")
    }
  }

  // Render message
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
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
      </View>
    )
  }

  // Render personality slider
  const renderPersonalitySlider = (trait, value) => (
    <View key={trait} style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{trait}</Text>
        <Text style={styles.sliderValue}>{value}%</Text>
      </View>
      <View style={styles.sliderControls}>
        <TouchableOpacity
          style={styles.sliderButton}
          onPress={() => adjustPersonality(trait, -10)}
        >
          <Minus size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${value}%` }]} />
        </View>
        <TouchableOpacity
          style={styles.sliderButton}
          onPress={() => adjustPersonality(trait, 10)}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )

  // Render dial pad
  const renderDialpad = () => (
    <View style={styles.dialpad}>
      <View style={styles.dialpadRow}>
        {['1', '2', '3'].map(digit => (
          <TouchableOpacity
            key={digit}
            style={styles.dialpadButton}
            onPress={() => handleDialpadPress(digit)}
          >
            <Text style={styles.dialpadText}>{digit}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.dialpadRow}>
        {['4', '5', '6'].map(digit => (
          <TouchableOpacity
            key={digit}
            style={styles.dialpadButton}
            onPress={() => handleDialpadPress(digit)}
          >
            <Text style={styles.dialpadText}>{digit}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.dialpadRow}>
        {['7', '8', '9'].map(digit => (
          <TouchableOpacity
            key={digit}
            style={styles.dialpadButton}
            onPress={() => handleDialpadPress(digit)}
          >
            <Text style={styles.dialpadText}>{digit}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.dialpadRow}>
        {['*', '0', '#'].map(digit => (
          <TouchableOpacity
            key={digit}
            style={styles.dialpadButton}
            onPress={() => handleDialpadPress(digit)}
          >
            <Text style={styles.dialpadText}>{digit}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.accent1} />
      
      {/* Blue header bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="white" />
          <Text style={styles.backText}>Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bot Interaction</Text>
      </View>

      <GradientView colors={THEME.background} style={styles.backgroundGradient}>
        {/* Menu and Title */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSidebarOpen(true)} style={styles.menuButton}>
            <Menu size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Bot Interaction</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeToggleContainer}>
          <TouchableOpacity
            style={[styles.modeButton, mode === "chat" && styles.activeModeButton]}
            onPress={() => setMode("chat")}
          >
            <MessageSquare size={18} color={mode === "chat" ? THEME.accent2 : "white"} />
            <Text style={[styles.modeButtonText, mode === "chat" && styles.activeModeText]}>
              Chat Mode
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === "call" && styles.activeModeButton]}
            onPress={() => setMode("call")}
          >
            <Phone size={18} color={mode === "call" ? THEME.accent2 : "white"} />
            <Text style={[styles.modeButtonText, mode === "call" && styles.activeModeText]}>
              Call Mode
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {mode === "chat" ? (
            <>
              {/* Personality Settings */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personality Settings</Text>
                {Object.entries(personalitySettings).map(([trait, value]) =>
                  renderPersonalitySlider(trait, value)
                )}
              </View>

              {/* Chat Area */}
              <View style={styles.chatContainer}>
                <ScrollView
                  ref={scrollViewRef}
                  style={styles.chatArea}
                  contentContainerStyle={styles.chatContent}
                >
                  {messages.length === 0 ? (
                    <View style={styles.emptyChat}>
                      <Bot size={48} color="rgba(255,255,255,0.3)" />
                      <Text style={styles.emptyText}>Start a conversation</Text>
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
                  <TouchableOpacity
                    onPress={sendMessage}
                    style={styles.sendButton}
                    disabled={isLoading || !currentMessage.trim()}
                  >
                    <Send size={22} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            /* Call Mode */
            <View style={styles.callContainer}>
              <View style={styles.callHeader}>
                <Text style={styles.callTitle}>AI Call Assistant</Text>
                {callStatus !== "idle" && (
                  <Text style={styles.callStatus}>{callStatus}</Text>
                )}
              </View>

              {/* Phone Input */}
              <TextInput
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter phone number..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                keyboardType="phone-pad"
              />

              {/* Hide/Show Dialpad */}
              <TouchableOpacity
                style={styles.dialpadToggle}
                onPress={() => setShowDialpad(!showDialpad)}
              >
                <Text style={styles.dialpadToggleText}>
                  {showDialpad ? "# Hide Dialpad" : "# Show Dialpad"}
                </Text>
              </TouchableOpacity>

              {/* Dialpad */}
              {showDialpad && renderDialpad()}

              {/* Call Buttons */}
              <View style={styles.callButtons}>
                {callStatus === "idle" ? (
                  <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                    <Phone size={24} color="white" />
                    <Text style={styles.callButtonText}>Start Call</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
                    <Phone size={24} color="white" />
                    <Text style={styles.callButtonText}>End Call</Text>
                  </TouchableOpacity>
                )}
              </View>
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
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.accent1,
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 15,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
  headerTitle: {
    flex: 1,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginRight: 80,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  modeToggleContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  activeModeButton: {
    backgroundColor: "white",
  },
  modeButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 14,
  },
  activeModeText: {
    color: THEME.accent2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sliderLabel: {
    color: "white",
    fontSize: 14,
  },
  sliderValue: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  sliderControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    marginHorizontal: 10,
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 4,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  chatArea: {
    flex: 1,
    maxHeight: 300,
  },
  chatContent: {
    padding: 15,
  },
  emptyChat: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    marginTop: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 12,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  botIcon: {
    backgroundColor: "rgba(255,255,255,0.3)",
    marginRight: 8,
  },
  userIcon: {
    backgroundColor: "rgba(255,255,255,0.3)",
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 12,
  },
  botBubble: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: "white",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  loadingText: {
    color: "rgba(255,255,255,0.7)",
    marginLeft: 10,
    fontSize: 14,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "white",
    fontSize: 14,
    maxHeight: 80,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  callContainer: {
    flex: 1,
  },
  callHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  callTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  callStatus: {
    fontSize: 14,
    color: "#FF4757",
    fontWeight: "600",
  },
  phoneInput: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 15,
    color: "white",
    fontSize: 16,
    marginBottom: 15,
  },
  dialpadToggle: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  dialpadToggleText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dialpad: {
    marginBottom: 20,
  },
  dialpadRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  dialpadButton: {
    width: 70,
    height: 70,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  dialpadText: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
  },
  callButtons: {
    marginTop: 20,
  },
  callButton: {
    backgroundColor: THEME.accent3,
    borderRadius: 15,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  endCallButton: {
    backgroundColor: "#FF4757",
    borderRadius: 15,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  callButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
})

export default BotInteractionScreen
