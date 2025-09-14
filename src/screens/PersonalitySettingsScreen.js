"use client"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Alert,
  Modal,
  FlatList,
  Dimensions,
  StatusBar,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
//import DocumentPicker from 'react-native-document-picker';
import {
  ChevronRight,
  Upload,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Settings,
  Bot,
  MessageSquare,
  Zap,
  Bell,
  Menu,
  X,
  FileText,
} from "lucide-react-native"
import { THEME } from "../styles/globalStyles"
import Card from "../components/Card"
import Slider from "../components/Slider"
import Sidebar from "../components/Sidebar"
import GradientView from "../components/GradientView"

const { width } = Dimensions.get("window")

const PersonalitySettingsScreen = ({ navigation }) => {
  // State Management
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("behavior")

  // Core personality settings
  const [tone, setTone] = useState("friendly")
  const [formalityLevel, setFormalityLevel] = useState(50)
  const [useEmojis, setUseEmojis] = useState(false)
  const [useSlang, setUseSlang] = useState(false)
  const [responseLength, setResponseLength] = useState("medium")
  const [showTypingIndicator, setShowTypingIndicator] = useState(true)

  // Messages
  const [greetingMessage, setGreetingMessage] = useState("Hello! How can I help you today?")
  const [farewellMessage, setFarewellMessage] = useState("Thank you for chatting! Have a great day!")
  const [errorMessage, setErrorMessage] = useState("I apologize, but I'm having trouble understanding that.")

  // Integration settings
  const [integrationConfig, setIntegrationConfig] = useState({
    apiKey: "",
    webhookUrl: "",
    crmSystem: "none",
    enableVoice: false,
    enableChat: true,
    enableEmail: false,
  })

  // Real-time preview
  const [previewQuery, setPreviewQuery] = useState("How can I help you?")
  const [previewResponse, setPreviewResponse] = useState("")

  // Training data
  const [trainingData, setTrainingData] = useState({
    uploadedFiles: [],
    customFAQs: [],
    lastTrainingDate: null,
  })

  // Behavioral sliders
  const [behaviorSliders, setBehaviorSliders] = useState({
    empathy: 50,
    assertiveness: 50,
    humor: 50,
    patience: 50,
    confidence: 50,
  })

  // Features configuration
  const [features, setFeatures] = useState({
    callHandling: false,
    appointmentBooking: false,
    customerNotifications: false,
    returnsHandling: false,
  })

  // Modal states
  const [faqModalVisible, setFaqModalVisible] = useState(false)
  const [newFaqQuestion, setNewFaqQuestion] = useState("")
  const [newFaqAnswer, setNewFaqAnswer] = useState("")

  const tabs = [
    { id: "behavior", label: "Behavior", icon: Settings },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "integration", label: "Integration", icon: Zap },
    { id: "training", label: "Training", icon: FileText },
  ]

  const toneOptions = [
    { label: "Friendly", value: "friendly" },
    { label: "Professional", value: "professional" },
    { label: "Casual", value: "casual" },
    { label: "Formal", value: "formal" },
  ]

  const responseLengthOptions = [
    { label: "Short", value: "short" },
    { label: "Medium", value: "medium" },
    { label: "Long", value: "long" },
  ]

  const crmSystems = [
    { label: "None", value: "none" },
    { label: "Salesforce", value: "salesforce" },
    { label: "HubSpot", value: "hubspot" },
    { label: "Zendesk", value: "zendesk" },
  ]

  const navItems = [
    { icon: Menu, label: "Dashboard", screen: "Dashboard" },
    { icon: Bot, label: "Bot Interaction", screen: "BotInteraction" },
    { icon: Settings, label: "Personality Settings", screen: "PersonalitySettings" },
    { icon: Menu, label: "Settings", screen: "Settings" },
  ]

  // Generate real-time preview based on current settings
  useEffect(() => {
    const generatePreview = () => {
      let response = ""
      const empathyLevel = behaviorSliders.empathy
      const profLevel = behaviorSliders.assertiveness

      if (empathyLevel > 75) {
        response = "I truly understand how frustrating this experience must have been for you. "
      } else if (empathyLevel > 50) {
        response = "Thank you for sharing your concerns with us. "
      } else {
        response = "I appreciate you letting us know about this issue. "
      }

      if (profLevel > 75) {
        response +=
          "We take such matters seriously and have already initiated a review of what happened. Rest assured, corrective actions are being taken. "
      } else if (profLevel > 50) {
        response += "We'll look into this matter promptly and address any underlying issues."
      } else {
        response +=
          "We will investigate this matter and ensure that steps are taken to avoid such incidents in the future."
      }

      if (useEmojis) response += " 😊"
      setPreviewResponse(response)
    }

    generatePreview()
  }, [behaviorSliders, useEmojis, tone, formalityLevel])

  // Handle file upload for training
  const handleFileUpload = async () => {
    try {
      // Temporarily disabled - will add back with compatible package
      Alert.alert(
        "File Upload", 
        "File upload feature will be available soon. For now, you can manually configure training data.",
        [{ text: "OK" }]
      )
      
      // TODO: Replace with expo-document-picker or compatible alternative
      // const result = await DocumentPicker.getDocumentAsync({
      //   type: ["text/plain", "text/csv", "application/json"],
      //   copyToCacheDirectory: true,
      //   multiple: true,
      // })
      // if (!result.canceled && result.assets) {
      //   setTrainingData((prev) => ({
      //     ...prev,
      //     uploadedFiles: [...prev.uploadedFiles, ...result.assets],
      //     lastTrainingDate: new Date().toISOString(),
      //   }))
      //   Alert.alert("Success", `${result.assets.length} file(s) uploaded successfully`)
      // }
    } catch (error) {
      Alert.alert("Error", "Failed to upload files")
    }
  }

  // Handle FAQ addition
  const handleAddFAQ = () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
      Alert.alert("Error", "Please fill in both question and answer")
      return
    }

    setTrainingData((prev) => ({
      ...prev,
      customFAQs: [...prev.customFAQs, { question: newFaqQuestion, answer: newFaqAnswer }],
    }))
    setNewFaqQuestion("")
    setNewFaqAnswer("")
    setFaqModalVisible(false)
    Alert.alert("Success", "FAQ added successfully")
  }

  // Remove FAQ
  const handleRemoveFAQ = (index) => {
    Alert.alert("Confirm Delete", "Are you sure you want to remove this FAQ?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setTrainingData((prev) => ({
            ...prev,
            customFAQs: prev.customFAQs.filter((_, i) => i !== index),
          }))
        },
      },
    ])
  }

  // Remove uploaded file
  const handleRemoveFile = (index) => {
    Alert.alert("Confirm Delete", "Are you sure you want to remove this file?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setTrainingData((prev) => ({
            ...prev,
            uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index),
          }))
        },
      },
    ])
  }

  // Save all settings
  const handleSave = async () => {
    const settings = {
      personality: {
        tone,
        formalityLevel,
        useEmojis,
        useSlang,
        responseLength,
        showTypingIndicator,
        behaviorSliders,
      },
      messages: {
        greeting: greetingMessage,
        farewell: farewellMessage,
        error: errorMessage,
      },
      integration: integrationConfig,
      features,
      trainingData,
    }

    Alert.alert("Success", "Settings saved successfully!")
    console.log("Saving settings:", settings)
  }

  // Reset to defaults
  const handleReset = () => {
    Alert.alert("Reset Settings", "Are you sure you want to reset all settings to default values?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          setTone("friendly")
          setFormalityLevel(50)
          setUseEmojis(false)
          setUseSlang(false)
          setBehaviorSliders({
            empathy: 50,
            assertiveness: 50,
            humor: 50,
            patience: 50,
            confidence: 50,
          })
          setFeatures({
            callHandling: false,
            appointmentBooking: false,
            customerNotifications: false,
            returnsHandling: false,
          })
          setGreetingMessage("Hello! How can I help you today?")
          setFarewellMessage("Thank you for chatting! Have a great day!")
          setErrorMessage("I apologize, but I'm having trouble understanding that.")
          setIntegrationConfig({
            apiKey: "",
            webhookUrl: "",
            crmSystem: "none",
            enableVoice: false,
            enableChat: true,
            enableEmail: false,
          })
          setTrainingData({
            uploadedFiles: [],
            customFAQs: [],
            lastTrainingDate: null,
          })
          Alert.alert("Success", "Settings reset to defaults")
        },
      },
    ])
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarOpen(true)}>
        <Menu size={24} color="rgba(255,255,255,0.8)" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <View style={styles.headerIcon}>
          <Bot size={32} color={THEME.text} />
        </View>
        <View>
          <Text style={styles.headerTitle}>AI Personality Configuration</Text>
          <Text style={styles.headerSubtitle}>Configure your AI assistant's personality and behavior</Text>
        </View>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
        <View style={styles.userProfile}>
          <View style={styles.avatar}>
          </View>
          <ChevronRight size={16} color="rgba(255,255,255,0.8)" />
        </View>
      </View>
    </View>
  )

  const renderTabNavigation = () => (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollView}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} color={activeTab === tab.id ? "#FF8A9B" : THEME.text} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )

  const renderBehaviorTab = () => (
    <View style={styles.tabContent}>
      <Card isSettingsCard title="Behavior Configuration">
        <View style={styles.slidersContainer}>
          {Object.entries(behaviorSliders).map(([trait, value]) => (
            <Slider
              key={trait}
              label={trait.charAt(0).toUpperCase() + trait.slice(1)}
              value={value}
              onValueChange={(newValue) =>
                setBehaviorSliders((prev) => ({
                  ...prev,
                  [trait]: newValue,
                }))
              }
            />
          ))}
        </View>
      </Card>

      <Card isSettingsCard title="Basic Settings">
        <View style={styles.basicSettingsGrid}>
          <View style={styles.pickerField}>
            <Text style={styles.fieldLabel}>Tone</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={tone} onValueChange={setTone} style={styles.picker} dropdownIconColor={THEME.text}>
                {toneOptions.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} color={THEME.text} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.pickerField}>
            <Text style={styles.fieldLabel}>Response Length</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={responseLength}
                onValueChange={setResponseLength}
                style={styles.picker}
                dropdownIconColor={THEME.text}
              >
                {responseLengthOptions.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} color={THEME.text} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxItem}>
            <Switch
              value={useEmojis}
              onValueChange={setUseEmojis}
              trackColor={{ false: "rgba(255,255,255,0.2)", true: THEME.primary }}
              thumbColor={THEME.text}
            />
            <Text style={styles.checkboxLabel}>Use Emojis</Text>
          </View>
          <View style={styles.checkboxItem}>
            <Switch
              value={useSlang}
              onValueChange={setUseSlang}
              trackColor={{ false: "rgba(255,255,255,0.2)", true: THEME.primary }}
              thumbColor={THEME.text}
            />
            <Text style={styles.checkboxLabel}>Use Slang</Text>
          </View>
          <View style={styles.checkboxItem}>
            <Switch
              value={showTypingIndicator}
              onValueChange={setShowTypingIndicator}
              trackColor={{ false: "rgba(255,255,255,0.2)", true: THEME.primary }}
              thumbColor={THEME.text}
            />
            <Text style={styles.checkboxLabel}>Show Typing Indicator</Text>
          </View>
        </View>
      </Card>

      <Card isSettingsCard title="Real-time Preview">
        <TextInput
          style={styles.previewInput}
          value={previewQuery}
          onChangeText={setPreviewQuery}
          placeholder="Type a sample query..."
          placeholderTextColor="rgba(255,255,255,0.6)"
        />
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Bot would respond:</Text>
          <View style={styles.previewBubble}>
            <Text style={styles.previewText}>
              {previewResponse || "Configure your settings to see a preview response..."}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  )

  const renderMessagesTab = () => (
    <View style={styles.tabContent}>
      <Card isSettingsCard title="Custom Messages">
        <View style={styles.messageField}>
          <Text style={styles.fieldLabel}>Greeting Message</Text>
          <TextInput
            style={styles.messageInput}
            value={greetingMessage}
            onChangeText={setGreetingMessage}
            multiline
            numberOfLines={3}
            placeholderTextColor="rgba(255,255,255,0.6)"
          />
        </View>
        <View style={styles.messageField}>
          <Text style={styles.fieldLabel}>Farewell Message</Text>
          <TextInput
            style={styles.messageInput}
            value={farewellMessage}
            onChangeText={setFarewellMessage}
            multiline
            numberOfLines={3}
            placeholderTextColor="rgba(255,255,255,0.6)"
          />
        </View>
        <View style={styles.messageField}>
          <Text style={styles.fieldLabel}>Error Message</Text>
          <TextInput
            style={styles.messageInput}
            value={errorMessage}
            onChangeText={setErrorMessage}
            multiline
            numberOfLines={3}
            placeholderTextColor="rgba(255,255,255,0.6)"
          />
        </View>
      </Card>
    </View>
  )

  const renderIntegrationTab = () => (
    <View style={styles.tabContent}>
      <Card isSettingsCard title="Integration Settings">
        <View style={styles.integrationGrid}>
          <View style={styles.inputField}>
            <Text style={styles.fieldLabel}>API Key</Text>
            <TextInput
              style={styles.textInput}
              value={integrationConfig.apiKey}
              onChangeText={(value) =>
                setIntegrationConfig((prev) => ({
                  ...prev,
                  apiKey: value,
                }))
              }
              placeholder="Enter API Key"
              placeholderTextColor="rgba(255,255,255,0.6)"
              secureTextEntry
            />
          </View>
          <View style={styles.inputField}>
            <Text style={styles.fieldLabel}>Webhook URL</Text>
            <TextInput
              style={styles.textInput}
              value={integrationConfig.webhookUrl}
              onChangeText={(value) =>
                setIntegrationConfig((prev) => ({
                  ...prev,
                  webhookUrl: value,
                }))
              }
              placeholder="Enter Webhook URL"
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType="url"
            />
          </View>
          <View style={styles.pickerField}>
            <Text style={styles.fieldLabel}>CRM System</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={integrationConfig.crmSystem}
                onValueChange={(value) =>
                  setIntegrationConfig((prev) => ({
                    ...prev,
                    crmSystem: value,
                  }))
                }
                style={styles.picker}
                dropdownIconColor={THEME.text}
              >
                {crmSystems.map((system) => (
                  <Picker.Item key={system.value} label={system.label} value={system.value} color={THEME.text} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
        <View style={styles.channelsSection}>
          <Text style={styles.sectionTitle}>Communication Channels</Text>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxItem}>
              <Switch
                value={integrationConfig.enableVoice}
                onValueChange={(value) =>
                  setIntegrationConfig((prev) => ({
                    ...prev,
                    enableVoice: value,
                  }))
                }
                trackColor={{ false: "rgba(255,255,255,0.2)", true: THEME.primary }}
                thumbColor={THEME.text}
              />
              <Text style={styles.checkboxLabel}>Enable Voice</Text>
            </View>
            <View style={styles.checkboxItem}>
              <Switch
                value={integrationConfig.enableChat}
                onValueChange={(value) =>
                  setIntegrationConfig((prev) => ({
                    ...prev,
                    enableChat: value,
                  }))
                }
                trackColor={{ false: "rgba(255,255,255,0.2)", true: THEME.primary }}
                thumbColor={THEME.text}
              />
              <Text style={styles.checkboxLabel}>Enable Chat</Text>
            </View>
            <View style={styles.checkboxItem}>
              <Switch
                value={integrationConfig.enableEmail}
                onValueChange={(value) =>
                  setIntegrationConfig((prev) => ({
                    ...prev,
                    enableEmail: value,
                  }))
                }
                trackColor={{ false: "rgba(255,255,255,0.2)", true: THEME.primary }}
                thumbColor={THEME.text}
              />
              <Text style={styles.checkboxLabel}>Enable Email</Text>
            </View>
          </View>
        </View>
      </Card>

      <Card isSettingsCard title="Features Configuration">
        <View style={styles.featuresGrid}>
          {Object.entries(features).map(([feature, enabled]) => (
            <View key={feature} style={styles.featureItem}>
              <Switch
                value={enabled}
                onValueChange={(value) =>
                  setFeatures((prev) => ({
                    ...prev,
                    [feature]: value,
                  }))
                }
                trackColor={{ false: "rgba(255,255,255,0.2)", true: THEME.primary }}
                thumbColor={THEME.text}
              />
              <Text style={styles.featureLabel}>
                {feature
                  .split(/(?=[A-Z])/)
                  .join(" ")
                  .replace(/^\w/, (c) => c.toUpperCase())}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  )

  const renderTrainingTab = () => (
    <View style={styles.tabContent}>
      <Card isSettingsCard title="Upload Training Files">
        <TouchableOpacity style={styles.uploadArea} onPress={handleFileUpload}>
          <Upload size={32} color="rgba(255,255,255,0.6)" />
          <Text style={styles.uploadText}>Click to upload files</Text>
          <Text style={styles.uploadSubtext}>Supports .txt, .csv, .json files</Text>
        </TouchableOpacity>
        {trainingData.uploadedFiles.length > 0 && (
          <View style={styles.filesContainer}>
            <Text style={styles.filesTitle}>Uploaded Files:</Text>
            {trainingData.uploadedFiles.map((file, index) => (
              <View key={index} style={styles.fileItem}>
                <Text style={styles.fileName}>{file.name}</Text>
                <TouchableOpacity onPress={() => handleRemoveFile(index)}>
                  <Trash2 size={16} color={THEME.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </Card>

      <Card isSettingsCard>
        <View style={styles.faqHeader}>
          <Text style={styles.cardTitle}>Custom FAQs</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setFaqModalVisible(true)}>
            <Plus size={16} color={THEME.text} />
            <Text style={styles.addButtonText}>Add FAQ</Text>
          </TouchableOpacity>
        </View>
        {trainingData.customFAQs.length > 0 ? (
          <FlatList
            data={trainingData.customFAQs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.faqItem}>
                <View style={styles.faqContent}>
                  <Text style={styles.faqQuestion}>Q: {item.question}</Text>
                  <Text style={styles.faqAnswer}>A: {item.answer}</Text>
                </View>
                <TouchableOpacity onPress={() => handleRemoveFAQ(index)}>
                  <Trash2 size={16} color={THEME.error} />
                </TouchableOpacity>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No custom FAQs added yet.</Text>
            <Text style={styles.emptySubtext}>Click "Add FAQ" to get started.</Text>
          </View>
        )}
      </Card>
    </View>
  )

  const renderFAQModal = () => (
    <Modal visible={faqModalVisible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#FF8A9B" />
        <GradientView colors={["#FF8A9B", "#FF9A9A"]} style={styles.backgroundGradient}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New FAQ</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setFaqModalVisible(false)}>
              <X size={24} color={THEME.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.inputField}>
              <Text style={styles.fieldLabel}>Question</Text>
              <TextInput
                style={styles.messageInput}
                value={newFaqQuestion}
                onChangeText={setNewFaqQuestion}
                placeholder="Enter the question..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                multiline
                numberOfLines={3}
              />
            </View>
            <View style={styles.inputField}>
              <Text style={styles.fieldLabel}>Answer</Text>
              <TextInput
                style={styles.messageInput}
                value={newFaqAnswer}
                onChangeText={setNewFaqAnswer}
                placeholder="Enter the answer..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                multiline
                numberOfLines={4}
              />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddFAQ}>
              <Text style={styles.saveButtonText}>Add FAQ</Text>
            </TouchableOpacity>
          </View>
        </GradientView>
      </View>
    </Modal>
  )

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Save size={20} color={THEME.text} />
        <Text style={styles.saveButtonText}>Save Configuration</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <RotateCcw size={20} color={THEME.text} />
        <Text style={styles.resetButtonText}>Reset to Defaults</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8A9B" />
      <GradientView colors={["#FF8A9B", "#FF9A9A"]} style={styles.backgroundGradient}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderHeader()}
          {renderTabNavigation()}
          {activeTab === "behavior" && renderBehaviorTab()}
          {activeTab === "messages" && renderMessagesTab()}
          {activeTab === "integration" && renderIntegrationTab()}
          {activeTab === "training" && renderTrainingTab()}
          {renderActionButtons()}
        </ScrollView>
        {renderFAQModal()}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          navItems={navItems}
          navigation={navigation}
          currentScreen="PersonalitySettings"
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
    color: "rgba(255,255,255,0.8)",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#FF9A56",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  userInitial: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  userName: {
    color: THEME.text,
    fontWeight: "600",
    marginRight: 4,
  },
  tabContainer: {
    paddingVertical: 16,
  },
  tabScrollView: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: THEME.text,
  },
  tabText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FF8A9B",
  },
  tabContent: {
    paddingHorizontal: 20,
    gap: 20,
  },
  slidersContainer: {
    gap: 8,
  },
  basicSettingsGrid: {
    gap: 16,
    marginBottom: 20,
  },
  pickerField: {
    gap: 8,
  },
  fieldLabel: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "500",
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
  checkboxContainer: {
    gap: 16,
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
  previewInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: THEME.text,
    fontSize: 16,
    marginBottom: 16,
  },
  previewContainer: {
    gap: 8,
  },
  previewLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  previewBubble: {
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    borderRadius: 12,
    padding: 16,
  },
  previewText: {
    color: THEME.text,
    fontSize: 14,
    lineHeight: 20,
  },
  messageField: {
    marginBottom: 20,
  },
  messageInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: THEME.text,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 80,
  },
  integrationGrid: {
    gap: 16,
    marginBottom: 20,
  },
  inputField: {
    gap: 8,
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: THEME.text,
    fontSize: 16,
  },
  channelsSection: {
    gap: 12,
  },
  sectionTitle: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: "600",
  },
  featuresGrid: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 12,
  },
  featureLabel: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  uploadArea: {
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 20,
  },
  uploadText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  uploadSubtext: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 4,
  },
  filesContainer: {
    gap: 8,
  },
  filesTitle: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "600",
  },
  fileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  fileName: {
    color: THEME.text,
    fontSize: 12,
    flex: 1,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: "500",
  },
  faqItem: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  faqContent: {
    flex: 1,
    gap: 8,
  },
  faqQuestion: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "600",
  },
  faqAnswer: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    lineHeight: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: THEME.text,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(139, 92, 246, 0.8)",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  resetButtonText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: "600",
  },
})

export default PersonalitySettingsScreen