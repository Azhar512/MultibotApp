"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Dimensions, Image } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { Picker } from "@react-native-picker/picker"
// import DocumentPicker from 'react-native-document-picker'; // ✅ Commented out
import Clipboard from '@react-native-clipboard/clipboard';
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

const { width } = Dimensions.get("window")

const EmbedOptionsScreen = ({ navigation }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("embed-options")
  const [customization, setCustomization] = useState({
    theme: "dark",
    width: "380",
    height: "600",
    position: "bottom-right",
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
    avatar: null,
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
    { id: "embed-options", label: "Embed Options" },
    { id: "features", label: "Features" },
    { id: "pricing", label: "Pricing" },
  ]

  const navItems = [
    { icon: Menu, label: "Dashboard", screen: "Dashboard" },
    { icon: Copy, label: "Embed Options", screen: "EmbedOptions" },
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
    return `<script>
  window.embedConfig = {
    theme: "${customization.theme}",
    width: "${customization.width}px",
    height: "${customization.height}px",
    position: "${customization.position}",
    primaryColor: "${customization.primaryColor}",
    secondaryColor: "${customization.secondaryColor}"
  };
</script>
<script src="https://embed.example.com/widget.js"></script>`
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
            theme: "dark",
            width: "380",
            height: "600",
            position: "bottom-right",
            primaryColor: "#3b82f6",
            secondaryColor: "#1e40af",
            avatar: null,
          })
        },
      },
    ])
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarOpen(true)}>
        <Menu size={24} color={THEME.text} />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Search size={16} color={THEME.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search"
          placeholderTextColor={THEME.textLight}
        />
      </View>

      <View style={styles.headerActions}>
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

  const renderHeroSection = () => (
    <View style={styles.heroSection}>
      <Text style={styles.heroTitle}>EmbedOptions</Text>
      <Text style={styles.heroSubtitle}>
        Customize and embed your chat interface seamlessly with our beautiful gradient theme.
      </Text>
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
      <Text style={styles.sectionTitle}>Customize Your Chat Widget</Text>

      <View style={styles.formGrid}>
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

        {/* Width */}
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Width (px)</Text>
          <TextInput
            style={styles.textInput}
            value={customization.width}
            onChangeText={(value) => handleCustomizationChange("width", value)}
            keyboardType="numeric"
            placeholder="380"
            placeholderTextColor={THEME.textLight}
          />
        </View>

        {/* Height */}
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Height (px)</Text>
          <TextInput
            style={styles.textInput}
            value={customization.height}
            onChangeText={(value) => handleCustomizationChange("height", value)}
            keyboardType="numeric"
            placeholder="600"
            placeholderTextColor={THEME.textLight}
          />
        </View>

        {/* Position */}
        <View style={styles.formField}>
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

      {/* Avatar Upload */}
      <View style={styles.avatarSection}>
        <Text style={styles.fieldLabel}>Bot Avatar</Text>
        <TouchableOpacity style={styles.uploadArea} onPress={handleAvatarUpload}>
          <Upload size={32} color={THEME.textLight} />
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
      <Text style={styles.sectionTitle}>Preview</Text>
      <View style={styles.previewContainer}>
        <View
          style={[
            styles.previewWidget,
            {
              backgroundColor: customization.theme === "dark" ? "#1f2937" : "#ffffff",
            },
          ]}
        >
          <View style={styles.previewMessage}>
            {customization.avatar ? (
              <Image source={{ uri: customization.avatar }} style={styles.previewAvatar} />
            ) : (
              <View style={styles.defaultAvatar}>
                <Text style={styles.avatarEmoji}>🤖</Text>
              </View>
            )}
            <View style={[styles.messageBubble, { backgroundColor: customization.primaryColor }]}>
              <Text style={styles.messageText}>Hello! How can I help you today?</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  )

  const renderEmbedCode = () => (
    <Card isSettingsCard>
      <Text style={styles.sectionTitle}>Embed Code</Text>
      <View style={styles.codeContainer}>
        <ScrollView style={styles.codeScrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.codeText}>{generateEmbedCode()}</Text>
        </ScrollView>
        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
          {showCopied ? <Text style={styles.copiedText}>Copied!</Text> : <Copy size={20} color={THEME.text} />}
        </TouchableOpacity>
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
          <Text style={styles.footerTitle}>EmbedOptions</Text>
          <Text style={styles.footerDescription}>
            Create beautiful, customizable chat widgets that seamlessly integrate with your website.
          </Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity style={styles.socialLink}>
              <Github size={20} color={THEME.textLight} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLink}>
              <Twitter size={20} color={THEME.textLight} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLink}>
              <Linkedin size={20} color={THEME.textLight} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLink}>
              <Mail size={20} color={THEME.textLight} />
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
        <Text style={styles.copyright}>© 2024 EmbedOptions. All rights reserved.</Text>
      </View>
    </View>
  )

  return (
    <LinearGradient colors={THEME.background} style={styles.container}>
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

        {activeTab === "features" && (
          <Card isSettingsCard>
            <Text style={styles.sectionTitle}>Features</Text>
            <Text style={styles.featureText}>
              • Fully customizable themes and colors{"\n"}• Multiple positioning options{"\n"}• Custom avatar support
              {"\n"}• Responsive design{"\n"}• Easy integration{"\n"}• Real-time preview
            </Text>
          </Card>
        )}

        {activeTab === "pricing" && (
          <Card isSettingsCard>
            <Text style={styles.sectionTitle}>Pricing</Text>
            <Text style={styles.pricingText}>
              Free tier: Up to 1,000 messages/month{"\n"}
              Pro tier: Unlimited messages - $29/month{"\n"}
              Enterprise: Custom solutions available
            </Text>
          </Card>
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
    marginRight: 8,
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
    color: THEME.textLight,
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
    color: THEME.primary,
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
    color: THEME.textLight,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  uploadSubtext: {
    color: THEME.textLight,
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
    backgroundColor: "linear-gradient(to right, #a855f7, #ec4899)",
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
    color: THEME.textLight,
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
    color: THEME.textLight,
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
    color: THEME.textLight,
    fontSize: 12,
  },
})

export default EmbedOptionsScreen
