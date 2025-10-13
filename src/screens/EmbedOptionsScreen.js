import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Dimensions,
  Image,
  StatusBar,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import * as Clipboard from "expo-clipboard"
import {
  ChevronRight,
  Copy,
  Upload,
  RefreshCw,
  Bell,
  Menu,
  Search,
  Code,
  Settings,
  Palette,
  Eye,
  CheckCircle,
} from "lucide-react-native"
import { THEME } from "../styles/globalStyles"
import Card from "../components/Card"
import ColorPicker from "../components/ColorPicker"
import Sidebar from "../components/Sidebar"
import GradientView from "../components/GradientView"

const { width, height } = Dimensions.get("window")

const EmbedOptionsScreen = ({ navigation }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("widget")
  const [customization, setCustomization] = useState({
    apiKey: "",
    theme: "dark",
    width: "380",
    height: "600",
    position: "bottom-right",
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    avatar: null,
    welcomeMessage: "Hello! How can I help you today?",
    autoOpen: "false",
    language: "en",
  })
  const [showCopied, setShowCopied] = useState(false)

  const navItems = [
    { icon: Menu, label: "Dashboard", screen: "Dashboard" },
    { icon: Code, label: "Embed Widget", screen: "EmbedOptions" },
    { icon: Settings, label: "Settings", screen: "Settings" },
  ]

  const tabs = [
    { id: "widget", label: "Widget Setup", icon: Code },
    { id: "preview", label: "Preview", icon: Eye },
    { id: "code", label: "Embed Code", icon: Copy },
  ]

  const positions = [
    { label: "Bottom Right", value: "bottom-right" },
    { label: "Bottom Left", value: "bottom-left" },
    { label: "Top Right", value: "top-right" },
    { label: "Top Left", value: "top-left" },
  ]

  const themes = [
    { label: "Dark Theme", value: "dark" },
    { label: "Light Theme", value: "light" },
    { label: "Custom Theme", value: "custom" },
  ]

  const languages = [
    { label: "English", value: "en" },
    { label: "Spanish", value: "es" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
  ]

  const handleCustomizationChange = (field, value) => {
    setCustomization((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAvatarUpload = async () => {
    Alert.alert(
      "Avatar Upload",
      "Avatar upload feature will be available soon. For now, you can use the default avatar.",
      [{ text: "OK" }]
    )
  }

  const generateEmbedCode = () => {
    return `<!-- CallSync AI Chat Widget -->
<script>
  window.callSyncConfig = {
    apiKey: "${customization.apiKey || 'your-api-key-here'}",
    theme: "${customization.theme}",
    width: "${customization.width}px",
    height: "${customization.height}px",
    position: "${customization.position}",
    primaryColor: "${customization.primaryColor}",
    secondaryColor: "${customization.secondaryColor}",
    avatar: "${customization.avatar || 'default'}",
    welcomeMessage: "${customization.welcomeMessage}",
    language: "${customization.language}",
    autoOpen: ${customization.autoOpen},
    enableTyping: true,
    enableSound: true
  };
</script>
<script src="https://widget.callsync.ai/v1/embed.js" async></script>
<!-- End CallSync Widget -->`
  }

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(generateEmbedCode())
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
      Alert.alert("Success", "Embed code copied to clipboard!")
    } catch (error) {
      Alert.alert("Error", "Failed to copy to clipboard")
    }
  }

  const resetCustomization = () => {
    Alert.alert(
      "Reset Configuration",
      "Are you sure you want to reset all settings to default values?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setCustomization({
              apiKey: "",
              theme: "dark",
              width: "380",
              height: "600",
              position: "bottom-right",
              primaryColor: "#667eea",
              secondaryColor: "#764ba2",
              avatar: null,
              welcomeMessage: "Hello! How can I help you today?",
              autoOpen: "false",
              language: "en",
            })
          },
        },
      ]
    )
  }

  // Header Component
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarOpen(true)}>
        <Menu size={24} color="white" />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Embed Widget</Text>
        <Text style={styles.headerSubtitle}>Configure & Deploy</Text>
      </View>

      <TouchableOpacity style={styles.notificationButton}>
        <Bell size={20} color="white" />
      </TouchableOpacity>
    </View>
  )

  // Tab Navigation
  const renderTabNavigation = () => (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Icon size={18} color={activeTab === tab.id ? THEME.primary : "rgba(255,255,255,0.6)"} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )

  // Widget Configuration Form
  const renderWidgetConfig = () => (
    <ScrollView style={styles.formScrollView} showsVerticalScrollIndicator={false}>
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Code size={24} color={THEME.primary} />
          <View>
            <Text style={styles.sectionTitle}>Widget Configuration</Text>
            <Text style={styles.sectionSubtitle}>Customize your chat widget</Text>
          </View>
        </View>

        {/* API Key */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            API Key <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={customization.apiKey}
            onChangeText={(value) => handleCustomizationChange("apiKey", value)}
            placeholder="Enter your API key"
            placeholderTextColor="rgba(255,255,255,0.4)"
            secureTextEntry
          />
          <Text style={styles.helpText}>Get your API key from the dashboard settings</Text>
        </View>

        {/* Theme */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Theme</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={customization.theme}
              onValueChange={(value) => handleCustomizationChange("theme", value)}
              style={styles.picker}
            >
              {themes.map((theme) => (
                <Picker.Item key={theme.value} label={theme.label} value={theme.value} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Dimensions */}
        <View style={styles.row}>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Width (px)</Text>
            <TextInput
              style={styles.input}
              value={customization.width}
              onChangeText={(value) => handleCustomizationChange("width", value)}
              keyboardType="numeric"
              placeholder="380"
              placeholderTextColor="rgba(255,255,255,0.4)"
            />
          </View>

          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Height (px)</Text>
            <TextInput
              style={styles.input}
              value={customization.height}
              onChangeText={(value) => handleCustomizationChange("height", value)}
              keyboardType="numeric"
              placeholder="600"
              placeholderTextColor="rgba(255,255,255,0.4)"
            />
          </View>
        </View>

        {/* Position & Language */}
        <View style={styles.row}>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Position</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={customization.position}
                onValueChange={(value) => handleCustomizationChange("position", value)}
                style={styles.picker}
              >
                {positions.map((pos) => (
                  <Picker.Item key={pos.value} label={pos.label} value={pos.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Language</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={customization.language}
                onValueChange={(value) => handleCustomizationChange("language", value)}
                style={styles.picker}
              >
                {languages.map((lang) => (
                  <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Colors */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Widget Colors</Text>
          <View style={styles.colorRow}>
            <View style={styles.colorGroup}>
              <Text style={styles.colorLabel}>Primary</Text>
              <View style={styles.colorInputContainer}>
                <View style={[styles.colorPreview, { backgroundColor: customization.primaryColor }]} />
                <TextInput
                  style={styles.colorInput}
                  value={customization.primaryColor}
                  onChangeText={(value) => handleCustomizationChange("primaryColor", value)}
                  placeholder="#667eea"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                />
              </View>
            </View>

            <View style={styles.colorGroup}>
              <Text style={styles.colorLabel}>Secondary</Text>
              <View style={styles.colorInputContainer}>
                <View style={[styles.colorPreview, { backgroundColor: customization.secondaryColor }]} />
                <TextInput
                  style={styles.colorInput}
                  value={customization.secondaryColor}
                  onChangeText={(value) => handleCustomizationChange("secondaryColor", value)}
                  placeholder="#764ba2"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Welcome Message */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Welcome Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={customization.welcomeMessage}
            onChangeText={(value) => handleCustomizationChange("welcomeMessage", value)}
            placeholder="Enter welcome message..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Auto Open */}
        <View style={styles.formGroup}>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.label}>Auto Open Widget</Text>
              <Text style={styles.helpText}>Automatically open chat on page load</Text>
            </View>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={customization.autoOpen}
                onValueChange={(value) => handleCustomizationChange("autoOpen", value)}
                style={styles.picker}
              >
                <Picker.Item label="Disabled" value="false" />
                <Picker.Item label="Enabled" value="true" />
              </Picker>
            </View>
          </View>
        </View>
      </Card>
    </ScrollView>
  )

  // Preview Widget
  const renderPreview = () => (
    <ScrollView style={styles.formScrollView} showsVerticalScrollIndicator={false}>
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Eye size={24} color={THEME.primary} />
          <View>
            <Text style={styles.sectionTitle}>Live Preview</Text>
            <Text style={styles.sectionSubtitle}>See how your widget will look</Text>
          </View>
        </View>

        <View style={styles.previewContainer}>
          <View
            style={[
              styles.previewWidget,
              {
                backgroundColor: customization.theme === "dark" ? "#1f2937" : "#ffffff",
                width: Math.min(parseInt(customization.width) || 380, width - 80),
                height: Math.min(parseInt(customization.height) || 600, height - 400),
              },
            ]}
          >
            {/* Widget Header */}
            <View
              style={[
                styles.widgetHeader,
                { backgroundColor: customization.primaryColor },
              ]}
            >
              <View style={styles.widgetHeaderContent}>
                <View style={styles.widgetAvatar}>
                  <Text style={styles.avatarText}>🤖</Text>
                </View>
                <View>
                  <Text style={styles.widgetTitle}>AI Assistant</Text>
                  <View style={styles.statusRow}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Online</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Widget Messages */}
            <View style={styles.widgetMessages}>
              {/* Bot Message */}
              <View style={styles.messageRow}>
                <View style={styles.messageAvatar}>
                  <Text style={styles.messageAvatarText}>🤖</Text>
                </View>
                <View
                  style={[
                    styles.messageBubble,
                    { backgroundColor: customization.primaryColor },
                  ]}
                >
                  <Text style={styles.messageText}>{customization.welcomeMessage}</Text>
                </View>
              </View>

              {/* User Message */}
              <View style={[styles.messageRow, styles.userMessageRow]}>
                <View style={[styles.messageBubble, styles.userBubble]}>
                  <Text style={[styles.messageText, styles.userMessageText]}>
                    Hello! I need help
                  </Text>
                </View>
                <View style={[styles.messageAvatar, styles.userAvatar]}>
                  <Text style={styles.messageAvatarText}>U</Text>
                </View>
              </View>
            </View>

            {/* Widget Input */}
            <View style={styles.widgetInputContainer}>
              <TextInput
                style={styles.widgetInput}
                placeholder="Type your message..."
                placeholderTextColor="rgba(0,0,0,0.4)"
                editable={false}
              />
              <TouchableOpacity
                style={[
                  styles.widgetSendButton,
                  { backgroundColor: customization.primaryColor },
                ]}
              >
                <Text style={styles.sendButtonText}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.previewInfo}>
          <CheckCircle size={16} color={THEME.success} />
          <Text style={styles.previewInfoText}>
            Widget is configured and ready to deploy
          </Text>
        </View>
      </Card>
    </ScrollView>
  )

  // Embed Code
  const renderEmbedCode = () => (
    <ScrollView style={styles.formScrollView} showsVerticalScrollIndicator={false}>
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Copy size={24} color={THEME.primary} />
          <View>
            <Text style={styles.sectionTitle}>Embed Code</Text>
            <Text style={styles.sectionSubtitle}>Copy and paste into your website</Text>
          </View>
        </View>

        {/* Code Block */}
        <View style={styles.codeBlock}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text style={styles.codeText}>{generateEmbedCode()}</Text>
          </ScrollView>
          
          <TouchableOpacity style={styles.copyCodeButton} onPress={copyToClipboard}>
            {showCopied ? (
              <>
                <CheckCircle size={18} color={THEME.success} />
                <Text style={styles.copiedText}>Copied!</Text>
              </>
            ) : (
              <>
                <Copy size={18} color="white" />
                <Text style={styles.copyButtonText}>Copy Code</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Integration Steps */}
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>Integration Steps</Text>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Copy the embed code</Text>
              <Text style={styles.stepDescription}>
                Click the "Copy Code" button above
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Paste before &lt;/body&gt;</Text>
              <Text style={styles.stepDescription}>
                Add the code just before the closing body tag in your HTML
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Replace API key</Text>
              <Text style={styles.stepDescription}>
                Replace 'your-api-key-here' with your actual API key
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Test your widget</Text>
              <Text style={styles.stepDescription}>
                Save and reload your website to see the widget in action
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.resetButton} onPress={resetCustomization}>
            <RefreshCw size={18} color="white" />
            <Text style={styles.resetButtonText}>Reset Config</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.testButton}>
            <Text style={styles.testButtonText}>Test Widget</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
      <GradientView colors={[THEME.primary, THEME.secondary]} style={styles.gradient}>
        {renderHeader()}
        {renderTabNavigation()}
        
        <View style={styles.content}>
          {activeTab === "widget" && renderWidgetConfig()}
          {activeTab === "preview" && renderPreview()}
          {activeTab === "code" && renderEmbedCode()}
        </View>

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          navItems={navItems}
          navigation={navigation}
          currentScreen="EmbedOptions"
        />
      </GradientView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    gap: 8,
  },
  activeTab: {
    backgroundColor: "white",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
  },
  activeTabText: {
    color: THEME.primary,
  },

  // Content
  content: {
    flex: 1,
  },
  formScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },

  // Form
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  required: {
    color: "#f87171",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "white",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  helpText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 6,
    fontStyle: "italic",
  },
  pickerWrapper: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    color: "white",
    height: 50,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  colorRow: {
    flexDirection: "row",
    gap: 12,
  },
  colorGroup: {
    flex: 1,
  },
  colorLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 6,
  },
  colorInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  colorInput: {
    flex: 1,
    fontSize: 14,
    color: "white",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Preview
  previewContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  previewWidget: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  widgetHeader: {
    padding: 16,
  },
  widgetHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  widgetAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
  },
  statusText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },
  widgetMessages: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  userMessageRow: {
    flexDirection: "row-reverse",
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#667eea",
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatar: {
    backgroundColor: "#3b82f6",
  },
  messageAvatarText: {
    fontSize: 14,
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#f3f4f6",
  },
  messageText: {
    fontSize: 14,
    color: "white",
    lineHeight: 20,
  },
  userMessageText: {
    color: "#1f2937",
  },
  widgetInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    gap: 8,
  },
  widgetInput: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },
  widgetSendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  previewInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(16,185,129,0.1)",
    borderRadius: 8,
  },
  previewInfoText: {
    fontSize: 13,
    color: THEME.success,
  },

  // Code Block
  codeBlock: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#4ade80",
    lineHeight: 18,
  },
  copyCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 12,
    gap: 8,
  },
  copyButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  copiedText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  // Steps
  stepsContainer: {
    marginBottom: 24,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  step: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 18,
  },

  // Actions
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  resetButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(239,68,68,0.2)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  resetButtonText: {
    color: "#f87171",
    fontSize: 14,
    fontWeight: "600",
  },
  testButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 12,
  },
  testButtonText: {
    color: THEME.primary,
    fontSize: 14,
    fontWeight: "600",
  },
})

export default EmbedOptionsScreen

