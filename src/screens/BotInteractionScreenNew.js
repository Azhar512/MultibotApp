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
  Modal,
  Alert,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import {
  MessageSquare,
  Phone,
  Send,
  Bot,
  User,
  Menu,
  Settings as SettingsIcon,
  X,
} from "lucide-react-native"
import { THEME } from "../styles/globalStyles"
import GradientView from "../components/GradientView"
import Sidebar from "../components/Sidebar"

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
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].value)
  const [selectedIndustry, setSelectedIndustry] = useState("general")
  const [personalitySettings, setPersonalitySettings] = useState(INDUSTRY_PRESETS.general)
  const [mode, setMode] = useState("chat") // 'chat' or 'call'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  
  const scrollViewRef = useRef(null)

  const navItems = [
    { icon: MessageSquare, label: "Dashboard", screen: "Dashboard" },
    { icon: Bot, label: "Bot Interaction", screen: "BotInteraction" },
    { icon: Phone, label: "Embed Options", screen: "EmbedOptions" },
    { icon: User, label: "Users", screen: "Users" },
  ]

  const sendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: currentMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")
    setIsLoading(true)

    try {
      // Call your bot API here
      const response = await fetch("http://168.231.114.68:5000/api/deepseek/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentMessage,
          personality: personalitySettings,
        }),
      })

      const data = await response.json()
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.text || data.response || "Sorry, I couldn't process that.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      Alert.alert("Error", "Failed to get response from bot")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [messages])

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

  const renderSettingsModal = () => (
    <Modal
      visible={settingsOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSettingsOpen(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity onPress={() => setSettingsOpen(false)}>
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Model Selection */}
            <Text style={styles.settingLabel}>Model Selection</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedModel}
                onValueChange={setSelectedModel}
                style={styles.picker}
              >
                {AVAILABLE_MODELS.map((model) => (
                  <Picker.Item key={model.value} label={model.label} value={model.value} />
                ))}
              </Picker>
            </View>

            {/* Industry Preset */}
            <Text style={styles.settingLabel}>Industry Preset</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedIndustry}
                onValueChange={(value) => {
                  setSelectedIndustry(value)
                  setPersonalitySettings(INDUSTRY_PRESETS[value])
                }}
                style={styles.picker}
              >
                <Picker.Item label="General" value="general" />
                <Picker.Item label="Finance" value="finance" />
                <Picker.Item label="Legal" value="legal" />
                <Picker.Item label="Real Estate" value="realEstate" />
                <Picker.Item label="Insurance" value="insurance" />
              </Picker>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
      <GradientView colors={[THEME.primary, THEME.secondary]} style={styles.backgroundGradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSidebarOpen(true)} style={styles.menuButton}>
            <Menu size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bot Interaction</Text>
          <TouchableOpacity onPress={() => setSettingsOpen(true)} style={styles.menuButton}>
            <SettingsIcon size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Chat Area */}
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
              <Text style={styles.loadingText}>AI is typing...</Text>
            </View>
          )}
        </ScrollView>

        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, mode === "chat" && styles.activeModeButton]}
            onPress={() => setMode("chat")}
          >
            <MessageSquare size={20} color="white" />
            <Text style={styles.modeButtonText}>Chat Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === "call" && styles.activeModeButton]}
            onPress={() => setMode("call")}
          >
            <Phone size={20} color="white" />
            <Text style={styles.modeButtonText}>Call Mode</Text>
          </TouchableOpacity>
        </View>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={currentMessage}
            onChangeText={setCurrentMessage}
            placeholder="Type your message..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            multiline
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={isLoading}>
            <Send size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Settings Modal */}
        {renderSettingsModal()}

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  menuButton: {
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
    marginTop: height * 0.2,
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
    order: 1,
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
  },
  botText: {
    color: "white",
  },
  userText: {
    color: "white",
  },
  loadingContainer: {
    paddingVertical: 10,
  },
  loadingText: {
    color: "rgba(255,255,255,0.6)",
    fontStyle: "italic",
  },
  modeToggle: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  modeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  activeModeButton: {
    backgroundColor: THEME.accent1,
  },
  modeButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
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
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: THEME.accent1,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: THEME.primary,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 30,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  modalBody: {
    padding: 20,
  },
  settingLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 15,
  },
  pickerContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    color: "white",
  },
})

export default BotInteractionScreen

