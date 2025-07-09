"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Switch, Dimensions } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { Picker } from "@react-native-picker/picker"
import {
  ChevronRight,
  MessageSquare,
  Phone,
  Settings,
  Mic,
  MicOff,
  Send,
  Bot,
  Users,
  Zap,
  Bell,
  Menu,
} from "lucide-react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { botAPI, twilioAPI } from "../services/api"
import { THEME } from "../styles/globalStyles"
import Card from "../components/Card"
import ChatWindow from "../components/ChatWindow"
import CallInterface from "../components/CallInterface"
import CrmPanel from "../components/CrmPanel"
import Sidebar from "../components/Sidebar"

const { width } = Dimensions.get("window")

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

const CRM_SYSTEMS = [
  { label: "HubSpot", value: "hubspot" },
  { label: "Salesforce", value: "salesforce" },
  { label: "Zoho CRM", value: "zoho" },
  { label: "No CRM Integration", value: "none" },
]

const BotInteractionScreen = ({ navigation }) => {
  // State Management
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState([])
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
  const [callStatus, setCallStatus] = useState("idle")
  const [callData, setCallData] = useState(null)
  const [selectedVoice, setSelectedVoice] = useState(VOICE_OPTIONS[0].value)

  // CRM integration states
  const [crmConfig, setCrmConfig] = useState({
    system: "none",
    enabled: false,
    autoLog: true,
    displayCustomerData: true,
  })
  const [customerData, setCustomerData] = useState(null)
  const [callSummary, setCallSummary] = useState(null)

  // Refs
  const twilioDeviceRef = useRef(null)
  const currentCallRef = useRef(null)

  const isDeepSeekModel = selectedModel === "deepseek-r1"
  const isOpenAIModel = selectedModel === "gpt-4-turbo"

  const navItems = [
    { icon: Bot, label: "Dashboard", screen: "Dashboard" },
    { icon: MessageSquare, label: "Bot Interaction", screen: "BotInteraction" },
    { icon: Settings, label: "Settings", screen: "Settings" },
  ]

  useEffect(() => {
    checkAuthAndConnection()
    return () => {
      if (twilioDeviceRef.current) {
        twilioDeviceRef.current.destroy()
      }
    }
  }, [])

  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
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
      const response = await fetch("/api/health-check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error("API health check failed")
      setApiStatus({
        isConnected: true,
        lastChecked: new Date(),
      })
    } catch (error) {
      setApiStatus({
        isConnected: false,
        lastChecked: new Date(),
        error: error.message,
      })
      setError("Unable to connect to API. Please check your connection and login status.")
    }
  }

  const handleIndustryChange = (industry) => {
    setSelectedIndustry(industry)
    setPersonalitySettings(INDUSTRY_PRESETS[industry])
  }

  const handlePersonalityChange = (trait, value) => {
    setPersonalitySettings((prev) => ({
      ...prev,
      [trait]: Number.parseInt(value),
    }))
  }

  const handleCrmSystemChange = (system) => {
    setCrmConfig((prev) => ({
      ...prev,
      system: system,
      enabled: system !== "none",
    }))
  }

  const handleModeChange = (mode) => {
    setActiveMode(mode)
    if (mode === "call" && !twilioDeviceRef.current) {
      initializeTwilioDevice()
    }
  }

  const initializeTwilioDevice = async () => {
    if (twilioDeviceRef.current) return
    try {
      console.log("Getting Twilio token...")
      const result = await twilioAPI.getToken()
      if (!result.success) {
        throw new Error(`Failed to get Twilio token: ${result.error}`)
      }
      // Initialize Twilio device logic here
      console.log("Twilio device initialized successfully")
    } catch (error) {
      console.error("Failed to initialize Twilio:", error)
      setError(`Failed to initialize call system: ${error.message}`)
    }
  }

  const handleMessageSubmit = async (text) => {
    if (!text || !text.trim()) {
      setError("Please enter a message")
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
      let result
      if (selectedModel === "deepseek-r1") {
        result = await botAPI.getDeepseekResponse(text, personalitySettings, botConfig)
      } else if (selectedModel === "gpt-4-turbo") {
        result = await botAPI.getOpenAIResponse(text, personalitySettings, {
          ...botConfig,
          voiceType: selectedVoice,
        })
      } else {
        result = await botAPI.getBertResponse(text, personalitySettings, selectedModel, botConfig)
      }

      if (!result.success) {
        throw new Error(result.error || "Failed to get response")
      }

      const botResponse = result.data?.botResponse || result.data?.text || "No response text"
      const confidence = result.data?.confidence || 0.5
      const sentiment = result.data?.sentiment || null

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

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarOpen(true)}>
        <Menu size={24} color={THEME.text} />
      </TouchableOpacity>

      <View style={styles.headerContent}>
        <View style={styles.headerIcon}>
          <Bot size={32} color={THEME.text} />
        </View>
        <View>
          <Text style={styles.headerTitle}>Bot Interaction</Text>
          <Text style={styles.headerSubtitle}>AI-powered chat and call interface</Text>
        </View>
      </View>

      <View style={styles.headerActions}>
        {!apiStatus.isConnected && (
          <View style={styles.disconnectedBadge}>
            <Text style={styles.disconnectedText}>API Disconnected</Text>
          </View>
        )}
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={20} color={THEME.text} />
        </TouchableOpacity>
        <View style={styles.userProfile}>
          <LinearGradient colors={["#f97316", "#ec4899"]} style={styles.avatar} />
          <Text style={styles.userName}>Azhar</Text>
          <ChevronRight size={16} color={THEME.text} />
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
          <MessageSquare size={16} color={activeMode === "chat" ? THEME.primary : THEME.text} />
          <Text style={[styles.modeTabText, activeMode === "chat" && styles.activeModeTabText]}>Chat Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeTab, activeMode === "call" && styles.activeModeTab]}
          onPress={() => handleModeChange("call")}
        >
          <Phone size={16} color={activeMode === "call" ? THEME.primary : THEME.text} />
          <Text style={[styles.modeTabText, activeMode === "call" && styles.activeModeTabText]}>Call Mode</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderSettingsPanel = () => (
    <ScrollView style={styles.settingsPanel} showsVerticalScrollIndicator={false}>
      {/* Model Selection - only visible in chat mode */}
      {activeMode === "chat" && (
        <Card isSettingsCard title="Model Selection">
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedModel}
              onValueChange={setSelectedModel}
              enabled={apiStatus.isConnected}
              style={styles.picker}
              dropdownIconColor={THEME.text}
            >
              {AVAILABLE_MODELS.map((model) => (
                <Picker.Item key={model.value} label={model.label} value={model.value} color={THEME.text} />
              ))}
            </Picker>
          </View>
        </Card>
      )}

      {/* Voice Selection - only for OpenAI models in chat mode */}
      {isOpenAIModel && activeMode === "chat" && (
        <Card isSettingsCard title="Voice Selection">
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedVoice}
              onValueChange={setSelectedVoice}
              enabled={apiStatus.isConnected}
              style={styles.picker}
              dropdownIconColor={THEME.text}
            >
              {VOICE_OPTIONS.map((voice) => (
                <Picker.Item key={voice.value} label={voice.label} value={voice.value} color={THEME.text} />
              ))}
            </Picker>
          </View>
        </Card>
      )}

      {/* Industry Selection - not for DeepSeek */}
      {!isDeepSeekModel && (
        <Card isSettingsCard title="Industry Preset">
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedIndustry}
              onValueChange={handleIndustryChange}
              enabled={apiStatus.isConnected}
              style={styles.picker}
              dropdownIconColor={THEME.text}
            >
              {Object.keys(INDUSTRY_PRESETS).map((industry) => (
                <Picker.Item
                  key={industry}
                  label={industry.charAt(0).toUpperCase() + industry.slice(1)}
                  value={industry}
                  color={THEME.text}
                />
              ))}
            </Picker>
          </View>
        </Card>
      )}

      {/* Personality Settings */}
      <Card isSettingsCard title="Personality Settings">
        <View style={styles.personalityContainer}>
          {Object.entries(personalitySettings).map(([trait, value]) => (
            <View key={trait} style={styles.personalityItem}>
              <View style={styles.personalityHeader}>
                <Text style={styles.personalityLabel}>{trait}</Text>
                <Text style={styles.personalityValue}>{value}%</Text>
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${value}%` }]} />
                </View>
                {/* Note: You'll need to install @react-native-community/slider for actual slider */}
                <Text style={styles.sliderNote}>Tap to adjust (slider component needed)</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* CRM Configuration - only in call mode */}
      {activeMode === "call" && (
        <Card isSettingsCard>
          <View style={styles.cardHeader}>
            <Users size={20} color={THEME.text} />
            <Text style={styles.cardTitle}>CRM Integration</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={crmConfig.system}
              onValueChange={handleCrmSystemChange}
              enabled={apiStatus.isConnected}
              style={styles.picker}
              dropdownIconColor={THEME.text}
            >
              {CRM_SYSTEMS.map((system) => (
                <Picker.Item key={system.value} label={system.label} value={system.value} color={THEME.text} />
              ))}
            </Picker>
          </View>
          {crmConfig.system !== "none" && (
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxItem}>
                <Switch
                  value={crmConfig.autoLog}
                  onValueChange={(value) =>
                    setCrmConfig((prev) => ({
                      ...prev,
                      autoLog: value,
                    }))
                  }
                  disabled={!apiStatus.isConnected}
                  trackColor={{ false: "rgba(255,255,255,0.2)", true: THEME.primary }}
                  thumbColor={THEME.text}
                />
                <Text style={styles.checkboxLabel}>Auto-log calls to CRM</Text>
              </View>
              <View style={styles.checkboxItem}>
                <Switch
                  value={crmConfig.displayCustomerData}
                  onValueChange={(value) =>
                    setCrmConfig((prev) => ({
                      ...prev,
                      displayCustomerData: value,
                    }))
                  }
                  disabled={!apiStatus.isConnected}
                  trackColor={{ false: "rgba(255,255,255,0.2)", true: THEME.primary }}
                  thumbColor={THEME.text}
                />
                <Text style={styles.checkboxLabel}>Display customer data</Text>
              </View>
            </View>
          )}
        </Card>
      )}

      {/* Bot Configuration */}
      <Card isSettingsCard>
        <View style={styles.cardHeader}>
          <Zap size={20} color={THEME.text} />
          <Text style={styles.cardTitle}>Bot Configuration</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxItem}>
            <Switch
              value={botConfig.enableVoice}
              onValueChange={(value) =>
                setBotConfig((prev) => ({
                  ...prev,
                  enableVoice: value,
                }))
              }
              disabled={!apiStatus.isConnected}
              trackColor={{ false: "rgba(255,255,255,0.2)", true: THEME.primary }}
              thumbColor={THEME.text}
            />
            <Text style={styles.checkboxLabel}>Enable Voice Input</Text>
          </View>
          <View style={styles.checkboxItem}>
            <Switch
              value={botConfig.enableTextToSpeech}
              onValueChange={(value) =>
                setBotConfig((prev) => ({
                  ...prev,
                  enableTextToSpeech: value,
                }))
              }
              disabled={!apiStatus.isConnected}
              trackColor={{ false: "rgba(255,255,255,0.2)", true: THEME.primary }}
              thumbColor={THEME.text}
            />
            <Text style={styles.checkboxLabel}>Enable Text-to-Speech</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  )

  const renderChatInterface = () => (
    <Card isSettingsCard>
      <ChatWindow messages={messages} isLoading={isLoading} error={error} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          value={currentMessage}
          onChangeText={setCurrentMessage}
          placeholder="Type your message..."
          placeholderTextColor={THEME.textLight}
          editable={!isLoading && apiStatus.isConnected}
          multiline
          onSubmitEditing={() => handleMessageSubmit(currentMessage)}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!currentMessage.trim() || isLoading || !apiStatus.isConnected) && styles.disabledButton,
          ]}
          onPress={() => handleMessageSubmit(currentMessage)}
          disabled={!currentMessage.trim() || isLoading || !apiStatus.isConnected}
        >
          <Send size={20} color={THEME.text} />
        </TouchableOpacity>
        {botConfig.enableVoice && (
          <TouchableOpacity
            style={[styles.voiceButton, isRecording && styles.recordingButton]}
            onPress={isRecording ? () => {} : () => {}} // Voice recording logic
            disabled={isLoading || !apiStatus.isConnected}
          >
            {isRecording ? <MicOff size={20} color={THEME.text} /> : <Mic size={20} color={THEME.text} />}
          </TouchableOpacity>
        )}
      </View>
    </Card>
  )

  const renderCallInterface = () => (
    <View style={styles.callInterfaceContainer}>
      <Card isSettingsCard>
        <CallInterface
          callStatus={callStatus}
          callData={callData}
          onInitiateCall={() => {}} // Call initiation logic
          onAnswerCall={() => {}} // Call answer logic
          onEndCall={() => {}} // Call end logic
          personalitySettings={personalitySettings}
          disabled={!apiStatus.isConnected}
        />
      </Card>
      {crmConfig.enabled && crmConfig.system !== "none" && (
        <Card isSettingsCard>
          <CrmPanel
            customerData={customerData}
            callSummary={callSummary}
            system={crmConfig.system}
            callInProgress={callStatus === "in-progress"}
          />
        </Card>
      )}
    </View>
  )

  return (
    <LinearGradient colors={THEME.background} style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderHeader()}

        {!apiStatus.isConnected && (
          <View style={styles.apiAlert}>
            <Text style={styles.apiAlertText}>
              API connection is unavailable. Please check your connection and login status.
            </Text>
          </View>
        )}

        {renderModeTabs()}

        <View style={styles.mainContent}>
          <View style={styles.settingsColumn}>{renderSettingsPanel()}</View>
          <View style={styles.interfaceColumn}>
            {activeMode === "chat" ? renderChatInterface() : renderCallInterface()}
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </ScrollView>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
        navigation={navigation}
        currentScreen="BotInteraction"
      />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  menuButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: THEME.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: THEME.textLight,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  disconnectedBadge: {
    backgroundColor: "rgba(248, 113, 113, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.3)",
  },
  disconnectedText: {
    color: THEME.error,
    fontSize: 10,
    fontWeight: "500",
  },
  notificationButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 15,
  },
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  userName: {
    color: THEME.text,
    fontWeight: "600",
    marginRight: 4,
  },
  apiAlert: {
    backgroundColor: "rgba(248, 113, 113, 0.2)",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.3)",
  },
  apiAlertText: {
    color: THEME.error,
    fontSize: 14,
  },
  modeTabsContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  modeTabs: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  modeTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeModeTab: {
    backgroundColor: THEME.text,
  },
  modeTabText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  activeModeTabText: {
    color: THEME.primary,
  },
  mainContent: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 20,
  },
  settingsColumn: {
    flex: 1,
  },
  interfaceColumn: {
    flex: 2,
  },
  settingsPanel: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  picker: {
    color: THEME.text,
    height: 50,
  },
  personalityContainer: {
    gap: 16,
  },
  personalityItem: {
    gap: 8,
  },
  personalityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  personalityLabel: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "500",
  },
  personalityValue: {
    color: THEME.textLight,
    fontSize: 12,
    fontWeight: "600",
  },
  sliderContainer: {
    gap: 4,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: THEME.primary,
  },
  sliderNote: {
    color: THEME.textLight,
    fontSize: 10,
    fontStyle: "italic",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  checkboxContainer: {
    gap: 12,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkboxLabel: {
    color: THEME.text,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    marginTop: 16,
  },
  messageInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: THEME.text,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: THEME.primary,
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  voiceButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  recordingButton: {
    backgroundColor: THEME.error,
  },
  disabledButton: {
    opacity: 0.5,
  },
  callInterfaceContainer: {
    gap: 20,
  },
  errorContainer: {
    backgroundColor: "rgba(248, 113, 113, 0.2)",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.3)",
  },
  errorText: {
    color: THEME.error,
    fontSize: 14,
  },
})

export default BotInteractionScreen
