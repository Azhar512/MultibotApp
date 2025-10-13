import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Dimensions, Image, StatusBar } from "react-native"
import { Picker } from "@react-native-picker/picker"
// import DocumentPicker from 'react-native-document-picker'; // ✅ Commented out
import * as Clipboard from 'expo-clipboard';
import {
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  Upload,
  RefreshCw,
  Bell,
  Menu,
  Search,
} from "lucide-react-native"
import { THEME } from "../styles/globalStyles"
import Card from "../components/Card"
import ColorPicker from "../components/ColorPicker"
import Sidebar from "../components/Sidebar"
import GradientView from "../components/GradientView"

const { width } = Dimensions.get("window")

const EmbedOptionsScreen = ({ navigation }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("embed-options")
  const [customization, setCustomization] = useState({
    apiKey: "",
    theme: "dark",
    width: "380",
    height: "600",
    position: "bottom-right",
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
    avatar: null,
    welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?",
    autoOpen: "false",
  })
  const [showCopied, setShowCopied] = useState(false)
  const [searchText, setSearchText] = useState("")

  const positions = [
    { label: "Bottom Right", value: "bottom-right" },
    { label: "Bottom Left", value: "bottom-left" },
    { label: "Top Right", value: "top-right" },
    { label: "Top Left", value: "top-left" },
  ]

  const themes = [
    { label: "Light Theme", value: "light" },
    { label: "Dark Theme", value: "dark" },
    { label: "Custom Theme", value: "custom" },
  ]

  const tabs = [
    { id: "embed-options", label: "Widget Setup" },
    { id: "features", label: "Features" },
    { id: "pricing", label: "Pricing" },
    { id: "analytics", label: "Analytics" },
  ]

  const navItems = [
    { icon: Menu, label: "Dashboard", screen: "Dashboard" },
    { icon: Copy, label: "CallSync Widget", screen: "EmbedOptions" },
    { icon: Github, label: "Settings", screen: "Settings" },
  ]

  const handleCustomizationChange = (field, value) => {
    setCustomization((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // ✅ Updated function without DocumentPicker
  const handleAvatarUpload = async () => {
    try {
      // Temporarily disabled - will add back with compatible package
      Alert.alert(
        "Avatar Upload", 
        "Avatar upload feature will be available soon. For now, you can use the default avatar.",
        [{ text: "OK" }]
      )
      
      // TODO: Replace with expo-document-picker or react-native-image-picker
      // const result = await DocumentPicker.getDocumentAsync({
      //   type: "image/*",
      //   copyToCacheDirectory: true,
      // })
      // if (!result.canceled && result.assets[0]) {
      //   handleCustomizationChange("avatar", result.assets[0].uri)
      // }
    } catch (error) {
      Alert.alert("Error", "Failed to upload image")
    }
  }

  const generateEmbedCode = () => {
    return `<!-- CallSync AI Chat Widget -->
<script>
  window.callSyncConfig = {
    apiKey: "your-api-key-here",
    theme: "${customization.theme}",
    width: "${customization.width}px",
    height: "${customization.height}px",
    position: "${customization.position}",
    primaryColor: "${customization.primaryColor}",
    secondaryColor: "${customization.secondaryColor}",
    avatar: "${customization.avatar || 'default'}",
    welcomeMessage: "Hello! I\'m your AI assistant. How can I help you today?",
    enableTyping: true,
    enableSound: true,
    autoOpen: false,
    language: "en"
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
    Alert.alert("Reset Customization", "Are you sure you want to reset all customization to default values?", [
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
            primaryColor: "#3b82f6",
            secondaryColor: "#1e40af",
            avatar: null,
            welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?",
            autoOpen: "false",
          })
        },
      },
    ])
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarOpen(true)}>
        <Menu size={24} color="rgba(255,255,255,0.8)" />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <Search size={16} color="rgba(255,255,255,0.6)" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search"
          placeholderTextColor="rgba(255,255,255,0.6)"
        />
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

  const renderHeroSection = () => (
    <View style={styles.heroSection}>
      <Text style={styles.heroTitle}>CallSync</Text>
      <Text style={styles.heroSubtitle}>
        Create powerful, customizable AI chat widgets that seamlessly integrate with your website. 
        Boost customer engagement with intelligent conversations.
      </Text>
      <View style={styles.heroStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>10K+</Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>99.9%</Text>
          <Text style={styles.statLabel}>Uptime</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24/7</Text>
          <Text style={styles.statLabel}>Support</Text>
        </View>
      </View>
    </View>
  )

  const renderTabNavigation = () => (
    <View style={styles.tabContainer}>
      <View style={styles.tabNavigation}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderCustomizationForm = () => (
    <Card isSettingsCard>
      <Text style={styles.sectionTitle}>Configure Your CallSync Widget</Text>
      <Text style={styles.sectionSubtitle}>
        Customize the appearance and behavior of your AI chat widget
      </Text>
      <View style={styles.formGrid}>
        {/* API Key */}
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>API Key *</Text>
          <TextInput
            style={styles.textInput}
            value={customization.apiKey || ""}
            onChangeText={(value) => handleCustomizationChange("apiKey", value)}
            placeholder="Enter your CallSync API key"
            placeholderTextColor="rgba(255,255,255,0.6)"
            secureTextEntry={true}
          />
          <Text style={styles.fieldHelp}>Get your API key from the CallSync dashboard</Text>
        </View>
        {/* Theme Selection */}
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Theme</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={customization.theme}
              onValueChange={(value) => handleCustomizationChange("theme", value)}
              style={styles.picker}
              dropdownIconColor={THEME.text}
            >
              {themes.map((theme) => (
                <Picker.Item key={theme.value} label={theme.label} value={theme.value} color={THEME.text} />
              ))}
            </Picker>
          </View>
        </View>
        {/* Dimensions */}
        <View style={styles.dimensionsRow}>
          <View style={[styles.formField, styles.halfField]}>
            <Text style={styles.fieldLabel}>Width (px)</Text>
            <TextInput
              style={styles.textInput}
              value={customization.width}
              onChangeText={(value) => handleCustomizationChange("width", value)}
              keyboardType="numeric"
              placeholder="380"
              placeholderTextColor="rgba(255,255,255,0.6)"
            />
          </View>
          <View style={[styles.formField, styles.halfField]}>
            <Text style={styles.fieldLabel}>Height (px)</Text>
            <TextInput
              style={styles.textInput}
              value={customization.height}
              onChangeText={(value) => handleCustomizationChange("height", value)}
              keyboardType="numeric"
              placeholder="600"
              placeholderTextColor="rgba(255,255,255,0.6)"
            />
          </View>
        </View>
        {/* Position and Behavior */}
        <View style={styles.dimensionsRow}>
          <View style={[styles.formField, styles.halfField]}>
            <Text style={styles.fieldLabel}>Position</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={customization.position}
                onValueChange={(value) => handleCustomizationChange("position", value)}
                style={styles.picker}
                dropdownIconColor={THEME.text}
              >
                {positions.map((position) => (
                  <Picker.Item key={position.value} label={position.label} value={position.value} color={THEME.text} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={[styles.formField, styles.halfField]}>
            <Text style={styles.fieldLabel}>Auto Open</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={customization.autoOpen || "false"}
                onValueChange={(value) => handleCustomizationChange("autoOpen", value)}
                style={styles.picker}
                dropdownIconColor={THEME.text}
              >
                <Picker.Item label="Disabled" value="false" color={THEME.text} />
                <Picker.Item label="Enabled" value="true" color={THEME.text} />
              </Picker>
            </View>
          </View>
        </View>
      </View>
      {/* Color Pickers */}
      <View style={styles.colorSection}>
        <ColorPicker
          label="Primary Color"
          value={customization.primaryColor}
          onValueChange={(value) => handleCustomizationChange("primaryColor", value)}
        />
        <ColorPicker
          label="Secondary Color"
          value={customization.secondaryColor}
          onValueChange={(value) => handleCustomizationChange("secondaryColor", value)}
        />
      </View>
      {/* Welcome Message */}
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Welcome Message</Text>
        <TextInput
          style={[styles.textInput, styles.textAreaInput]}
          value={customization.welcomeMessage || ""}
          onChangeText={(value) => handleCustomizationChange("welcomeMessage", value)}
          placeholder="Hello! I'm your AI assistant. How can I help you today?"
          placeholderTextColor="rgba(255,255,255,0.6)"
          multiline
          numberOfLines={3}
        />
      </View>
      {/* Avatar Upload */}
      <View style={styles.avatarSection}>
        <Text style={styles.fieldLabel}>Bot Avatar</Text>
        <TouchableOpacity style={styles.uploadArea} onPress={handleAvatarUpload}>
          <Upload size={32} color="rgba(255,255,255,0.6)" />
          <Text style={styles.uploadText}>Click to upload</Text>
          <Text style={styles.uploadSubtext}>PNG, JPG or GIF (MAX. 800x400px)</Text>
        </TouchableOpacity>
        {customization.avatar && (
          <View style={styles.avatarPreview}>
            <Image source={{ uri: customization.avatar }} style={styles.avatarImage} />
            <TouchableOpacity
              style={styles.removeAvatarButton}
              onPress={() => handleCustomizationChange("avatar", null)}
            >
              <Text style={styles.removeAvatarText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Card>
  )

  const renderPreview = () => (
    <Card isSettingsCard>
      <Text style={styles.sectionTitle}>Live Preview</Text>
      <Text style={styles.sectionSubtitle}>See how your widget will look on your website</Text>
      <View style={styles.previewContainer}>
        <View
          style={[
            styles.previewWidget,
            {
              backgroundColor: customization.theme === "dark" ? "#1f2937" : "#ffffff",
              width: Math.min(parseInt(customization.width) || 380, 300),
              height: Math.min(parseInt(customization.height) || 600, 400),
            },
          ]}
        >
          <View style={styles.previewHeader}>
            <View style={styles.previewTitleContainer}>
              {customization.avatar ? (
                <Image source={{ uri: customization.avatar }} style={styles.previewAvatar} />
              ) : (
                <View style={styles.defaultAvatar}>
                  <Text style={styles.avatarEmoji}>🤖</Text>
                </View>
              )}
              <Text style={styles.previewTitle}>CallSync AI</Text>
            </View>
            <View style={styles.previewStatus}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
          <View style={styles.previewMessages}>
            <View style={styles.previewMessage}>
              {customization.avatar ? (
                <Image source={{ uri: customization.avatar }} style={styles.previewAvatar} />
              ) : (
                <View style={styles.defaultAvatar}>
                  <Text style={styles.avatarEmoji}>🤖</Text>
                </View>
              )}
              <View style={[styles.messageBubble, { backgroundColor: customization.primaryColor }]}>
                <Text style={styles.messageText}>{customization.welcomeMessage || "Hello! How can I help you today?"}</Text>
              </View>
            </View>
            <View style={styles.previewMessage}>
              <View style={styles.userAvatar}>
                <Text style={styles.userInitial}>U</Text>
              </View>
              <View style={styles.userBubble}>
                <Text style={styles.userMessageText}>Hi there!</Text>
              </View>
            </View>
          </View>
          <View style={styles.previewInput}>
            <TextInput
              style={styles.previewInputField}
              placeholder="Type your message..."
              placeholderTextColor="rgba(0,0,0,0.5)"
              editable={false}
            />
            <TouchableOpacity style={styles.previewSendButton}>
              <Text style={styles.previewSendText}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  )

  const renderEmbedCode = () => (
    <Card isSettingsCard>
      <Text style={styles.sectionTitle}>Integration Code</Text>
      <Text style={styles.sectionSubtitle}>Copy this code and paste it into your website's HTML</Text>
      <View style={styles.codeContainer}>
        <ScrollView style={styles.codeScrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.codeText}>{generateEmbedCode()}</Text>
        </ScrollView>
        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
          {showCopied ? <Text style={styles.copiedText}>Copied!</Text> : <Copy size={20} color={THEME.text} />}
        </TouchableOpacity>
      </View>
      <View style={styles.integrationSteps}>
        <Text style={styles.stepsTitle}>Integration Steps:</Text>
        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>Copy the code above</Text>
        </View>
        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>Paste it before the closing &lt;/body&gt; tag</Text>
        </View>
        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>Replace 'your-api-key-here' with your actual API key</Text>
        </View>
        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>4</Text>
          <Text style={styles.stepText}>Save and test your website</Text>
        </View>
      </View>
    </Card>
  )

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.resetButton} onPress={resetCustomization}>
        <RefreshCw size={20} color={THEME.text} />
        <Text style={styles.resetButtonText}>Reset to Default</Text>
      </TouchableOpacity>
    </View>
  )

  const renderFooter = () => (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <View style={styles.footerSection}>
          <Text style={styles.footerTitle}>CallSync</Text>
          <Text style={styles.footerDescription}>
            The most powerful AI chat widget platform. Boost customer engagement with intelligent conversations that convert.
          </Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity style={styles.socialLink}>
              <Github size={20} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLink}>
              <Twitter size={20} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLink}>
              <Linkedin size={20} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLink}>
              <Mail size={20} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footerLinks}>
          <View style={styles.linkColumn}>
            <Text style={styles.linkColumnTitle}>Product</Text>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Features</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Pricing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Documentation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>API</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.linkColumn}>
            <Text style={styles.linkColumnTitle}>Support</Text>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Help Center</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Status</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Community</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.footerBottom}>
        <Text style={styles.copyright}>© 2024 CallSync. All rights reserved.</Text>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8A9B" />
      <GradientView colors={["#FF8A9B", "#FF9A9A"]} style={styles.backgroundGradient}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderHeader()}
          {renderHeroSection()}
          {renderTabNavigation()}
          {activeTab === "embed-options" && (
            <View style={styles.mainContent}>
              {renderCustomizationForm()}
              {renderPreview()}
              {renderEmbedCode()}
              {renderActionButtons()}
            </View>
          )}
          {activeTab === "analytics" && (
            <View style={styles.mainContent}>
              <Card isSettingsCard>
                <Text style={styles.sectionTitle}>Analytics Dashboard</Text>
                <Text style={styles.sectionSubtitle}>Track your widget performance and user engagement</Text>
                <View style={styles.analyticsGrid}>
                  <View style={styles.analyticsCard}>
                    <Text style={styles.analyticsNumber}>1,247</Text>
                    <Text style={styles.analyticsLabel}>Total Conversations</Text>
                    <Text style={styles.analyticsChange}>+12% this week</Text>
                  </View>
                  <View style={styles.analyticsCard}>
                    <Text style={styles.analyticsNumber}>89%</Text>
                    <Text style={styles.analyticsLabel}>Satisfaction Rate</Text>
                    <Text style={styles.analyticsChange}>+5% this week</Text>
                  </View>
                  <View style={styles.analyticsCard}>
                    <Text style={styles.analyticsNumber}>2.3s</Text>
                    <Text style={styles.analyticsLabel}>Avg Response Time</Text>
                    <Text style={styles.analyticsChange}>-0.2s this week</Text>
                  </View>
                  <View style={styles.analyticsCard}>
                    <Text style={styles.analyticsNumber}>156</Text>
                    <Text style={styles.analyticsLabel}>Active Users</Text>
                    <Text style={styles.analyticsChange}>+23 this week</Text>
                  </View>
                </View>
              </Card>
            </View>
          )}
          {activeTab === "features" && (
            <View style={styles.mainContent}>
              <Card isSettingsCard>
                <Text style={styles.sectionTitle}>CallSync Features</Text>
                <View style={styles.featuresGrid}>
                  <View style={styles.featureCard}>
                    <Text style={styles.featureIcon}>🤖</Text>
                    <Text style={styles.featureTitle}>AI-Powered</Text>
                    <Text style={styles.featureDescription}>Advanced AI that understands context and provides intelligent responses</Text>
                  </View>
                  <View style={styles.featureCard}>
                    <Text style={styles.featureIcon}>🎨</Text>
                    <Text style={styles.featureTitle}>Customizable</Text>
                    <Text style={styles.featureDescription}>Fully customizable themes, colors, and positioning to match your brand</Text>
                  </View>
                  <View style={styles.featureCard}>
                    <Text style={styles.featureIcon}>📊</Text>
                    <Text style={styles.featureTitle}>Analytics</Text>
                    <Text style={styles.featureDescription}>Track conversations, user engagement, and performance metrics</Text>
                  </View>
                  <View style={styles.featureCard}>
                    <Text style={styles.featureIcon}>🔒</Text>
                    <Text style={styles.featureTitle}>Secure</Text>
                    <Text style={styles.featureDescription}>Enterprise-grade security with data encryption and privacy protection</Text>
                  </View>
                  <View style={styles.featureCard}>
                    <Text style={styles.featureIcon}>⚡</Text>
                    <Text style={styles.featureTitle}>Fast</Text>
                    <Text style={styles.featureDescription}>Lightning-fast responses with optimized performance and caching</Text>
                  </View>
                  <View style={styles.featureCard}>
                    <Text style={styles.featureIcon}>🌍</Text>
                    <Text style={styles.featureTitle}>Multi-language</Text>
                    <Text style={styles.featureDescription}>Support for 50+ languages with automatic translation capabilities</Text>
                  </View>
                </View>
              </Card>
            </View>
          )}
          {activeTab === "pricing" && (
            <View style={styles.mainContent}>
              <Card isSettingsCard>
                <Text style={styles.sectionTitle}>CallSync Pricing</Text>
                <Text style={styles.sectionSubtitle}>Choose the perfect plan for your business needs</Text>
                <View style={styles.pricingGrid}>
                  <View style={styles.pricingCard}>
                    <Text style={styles.pricingTitle}>Free</Text>
                    <Text style={styles.pricingPrice}>$0<Text style={styles.pricingPeriod}>/month</Text></Text>
                    <Text style={styles.pricingDescription}>Perfect for small websites and testing</Text>
                    <View style={styles.pricingFeatures}>
                      <Text style={styles.pricingFeature}>✓ Up to 1,000 messages/month</Text>
                      <Text style={styles.pricingFeature}>✓ Basic customization</Text>
                      <Text style={styles.pricingFeature}>✓ Email support</Text>
                      <Text style={styles.pricingFeature}>✓ Standard AI models</Text>
                    </View>
                    <TouchableOpacity style={styles.pricingButton}>
                      <Text style={styles.pricingButtonText}>Get Started</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.pricingCard, styles.pricingCardFeatured]}>
                    <View style={styles.featuredBadge}>
                      <Text style={styles.featuredText}>Most Popular</Text>
                    </View>
                    <Text style={styles.pricingTitle}>Pro</Text>
                    <Text style={styles.pricingPrice}>$29<Text style={styles.pricingPeriod}>/month</Text></Text>
                    <Text style={styles.pricingDescription}>Ideal for growing businesses</Text>
                    <View style={styles.pricingFeatures}>
                      <Text style={styles.pricingFeature}>✓ Unlimited messages</Text>
                      <Text style={styles.pricingFeature}>✓ Advanced customization</Text>
                      <Text style={styles.pricingFeature}>✓ Priority support</Text>
                      <Text style={styles.pricingFeature}>✓ Premium AI models</Text>
                      <Text style={styles.pricingFeature}>✓ Analytics dashboard</Text>
                      <Text style={styles.pricingFeature}>✓ Custom branding</Text>
                    </View>
                    <TouchableOpacity style={[styles.pricingButton, styles.pricingButtonFeatured]}>
                      <Text style={styles.pricingButtonText}>Start Free Trial</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.pricingCard}>
                    <Text style={styles.pricingTitle}>Enterprise</Text>
                    <Text style={styles.pricingPrice}>Custom</Text>
                    <Text style={styles.pricingDescription}>For large organizations</Text>
                    <View style={styles.pricingFeatures}>
                      <Text style={styles.pricingFeature}>✓ Everything in Pro</Text>
                      <Text style={styles.pricingFeature}>✓ Dedicated support</Text>
                      <Text style={styles.pricingFeature}>✓ Custom integrations</Text>
                      <Text style={styles.pricingFeature}>✓ SLA guarantee</Text>
                      <Text style={styles.pricingFeature}>✓ On-premise deployment</Text>
                      <Text style={styles.pricingFeature}>✓ Custom AI training</Text>
                    </View>
                    <TouchableOpacity style={styles.pricingButton}>
                      <Text style={styles.pricingButtonText}>Contact Sales</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            </View>
          )}
          {renderFooter()}
        </ScrollView>
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
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: THEME.text,
    fontSize: 16,
    paddingVertical: 12,
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
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 16,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: width - 40,
  },
  tabContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  tabNavigation: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
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
  mainContent: {
    paddingHorizontal: 20,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 20,
    textAlign: "center",
  },
  formGrid: {
    gap: 16,
    marginBottom: 20,
  },
  formField: {
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
  colorSection: {
    gap: 16,
    marginBottom: 20,
  },
  avatarSection: {
    gap: 12,
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
  avatarPreview: {
    alignItems: "center",
    gap: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  removeAvatarButton: {
    backgroundColor: THEME.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeAvatarText: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: "600",
  },
  previewContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  previewWidget: {
    borderRadius: 12,
    padding: 20,
    maxWidth: 300,
    alignSelf: "center",
  },
  previewMessage: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#a855f7",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEmoji: {
    fontSize: 16,
  },
  messageBubble: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
  },
  messageText: {
    color: THEME.text,
    fontSize: 14,
  },
  codeContainer: {
    position: "relative",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    height: 160,
  },
  codeScrollView: {
    flex: 1,
    padding: 16,
  },
  codeText: {
    color: "#4ade80",
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 18,
  },
  copyButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
    borderRadius: 8,
  },
  copiedText: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: "600",
  },
  actionButtons: {
    alignItems: "center",
    marginVertical: 20,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  resetButtonText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "500",
  },
  featureText: {
    color: THEME.text,
    fontSize: 16,
    lineHeight: 24,
  },
  pricingText: {
    color: THEME.text,
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 40,
    marginTop: 40,
  },
  footerContent: {
    gap: 30,
  },
  footerSection: {
    gap: 16,
  },
  footerTitle: {
    color: THEME.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  footerDescription: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    lineHeight: 20,
  },
  socialLinks: {
    flexDirection: "row",
    gap: 16,
  },
  socialLink: {
    padding: 8,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  linkColumn: {
    gap: 12,
  },
  linkColumnTitle: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: "600",
  },
  linkItem: {
    paddingVertical: 4,
  },
  linkText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    paddingTop: 20,
    marginTop: 30,
    alignItems: "center",
  },
  copyright: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  // New styles for enhanced UI
  heroStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  fieldHelp: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
    fontStyle: "italic",
  },
  dimensionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  textAreaInput: {
    height: 80,
    textAlignVertical: "top",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    marginBottom: 12,
  },
  previewTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  previewStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "500",
  },
  previewMessages: {
    flex: 1,
    gap: 8,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
  },
  userInitial: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  userBubble: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 8,
    maxWidth: "80%",
  },
  userMessageText: {
    color: "#333",
    fontSize: 12,
  },
  previewInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  previewInputField: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    marginRight: 8,
  },
  previewSendButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
  },
  previewSendText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  integrationSteps: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME.text,
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.primary,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 24,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 20,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 20,
  },
  featureCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME.text,
    marginBottom: 8,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 16,
  },
  pricingGrid: {
    flexDirection: "row",
    gap: 16,
    marginTop: 20,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  pricingCardFeatured: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 2,
    borderColor: THEME.primary,
  },
  featuredBadge: {
    position: "absolute",
    top: -8,
    backgroundColor: THEME.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 32,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 4,
  },
  pricingPeriod: {
    fontSize: 14,
    fontWeight: "normal",
    color: "rgba(255,255,255,0.8)",
  },
  pricingDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 20,
  },
  pricingFeatures: {
    width: "100%",
    marginBottom: 20,
  },
  pricingFeature: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 6,
    lineHeight: 16,
  },
  pricingButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  pricingButtonFeatured: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  pricingButtonText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "600",
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 20,
  },
  analyticsCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  analyticsNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 4,
  },
  analyticsChange: {
    fontSize: 10,
    color: "#10B981",
    fontWeight: "500",
  },
})

export default EmbedOptionsScreen