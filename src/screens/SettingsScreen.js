import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
  Dimensions,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import GradientView from "../components/GradientView"

const { width } = Dimensions.get("window")

const SettingsScreen = () => {
  // State management
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [loginNotifications, setLoginNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false)
  const [showSessionsModal, setShowSessionsModal] = useState(false)
  const [showSecurityLogModal, setShowSecurityLogModal] = useState(false)

  // Mock data
  const backupCodes = ["1234-5678-9012", "3456-7890-1234", "5678-9012-3456", "7890-1234-5678", "9012-3456-7890"]

  const activeSessions = [
    {
      id: "1",
      device: "iPhone 14 Pro",
      location: "New York, NY",
      lastActive: "2 minutes ago",
      current: true,
    },
    {
      id: "2",
      device: "MacBook Pro",
      location: "New York, NY",
      lastActive: "1 hour ago",
      current: false,
    },
    {
      id: "3",
      device: "iPad Air",
      location: "Boston, MA",
      lastActive: "2 days ago",
      current: false,
    },
  ]

  const securityLog = [
    {
      id: "1",
      action: "Login",
      device: "iPhone 14 Pro",
      location: "New York, NY",
      timestamp: "2024-01-15 10:30 AM",
      status: "success",
    },
    {
      id: "2",
      action: "Password Changed",
      device: "MacBook Pro",
      location: "New York, NY",
      timestamp: "2024-01-14 3:45 PM",
      status: "success",
    },
    {
      id: "3",
      action: "Failed Login Attempt",
      device: "Unknown Device",
      location: "Unknown Location",
      timestamp: "2024-01-13 11:20 PM",
      status: "failed",
    },
  ]

  // Password validation
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
    return requirements
  }

  const passwordRequirements = validatePassword(newPassword)
  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean)

  // Handlers
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible)
  }

  const handlePasswordSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields")
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match")
      return
    }

    if (!allRequirementsMet) {
      Alert.alert("Error", "Password does not meet all requirements")
      return
    }

    Alert.alert("Success", "Password updated successfully")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleTwoFactorSetup = () => {
    Alert.alert(
      "Two-Factor Authentication",
      "This will guide you through setting up 2FA with your authenticator app.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: () => console.log("2FA setup") },
      ],
    )
  }

  const generateBackupCodes = () => {
    Alert.alert("Success", "New backup codes generated successfully")
  }

  const terminateSession = (sessionId) => {
    Alert.alert("Terminate Session", "Are you sure you want to terminate this session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Terminate",
        style: "destructive",
        onPress: () => Alert.alert("Success", "Session terminated successfully"),
      },
    ])
  }

  // Password requirement indicator
  const RequirementIndicator = ({ met, text }) => (
    <View style={styles.requirementItem}>
      <Icon name={met ? "check-circle" : "circle"} size={16} color={met ? "#22c55e" : "rgba(255,255,255,0.5)"} />
      <Text style={[styles.requirementText, { color: met ? "#22c55e" : "rgba(255,255,255,0.7)" }]}>{text}</Text>
    </View>
  )

  // Backup codes modal
  const BackupCodesModal = () => (
    <Modal
      visible={showBackupCodesModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowBackupCodesModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Backup Codes</Text>
            <TouchableOpacity onPress={() => setShowBackupCodesModal(false)} style={styles.closeButton}>
              <Icon name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            <Text style={styles.backupCodesDescription}>
              Save these backup codes in a safe place. You can use them to access your account if you lose your
              authenticator device.
            </Text>
            <View style={styles.backupCodesContainer}>
              {backupCodes.map((code, index) => (
                <View key={index} style={styles.backupCodeItem}>
                  <Text style={styles.backupCodeText}>{code}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.generateCodesButton} onPress={generateBackupCodes}>
              <Icon name="refresh-cw" size={16} color="#fff" />
              <Text style={styles.generateCodesText}>Generate New Codes</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

  // Active sessions modal
  const SessionsModal = () => (
    <Modal
      visible={showSessionsModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSessionsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Active Sessions</Text>
            <TouchableOpacity onPress={() => setShowSessionsModal(false)} style={styles.closeButton}>
              <Icon name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {activeSessions.map((session) => (
              <View key={session.id} style={styles.sessionItem}>
                <View style={styles.sessionInfo}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionDevice}>{session.device}</Text>
                    {session.current && (
                      <View style={styles.currentSessionBadge}>
                        <Text style={styles.currentSessionText}>Current</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.sessionLocation}>{session.location}</Text>
                  <Text style={styles.sessionLastActive}>Last active: {session.lastActive}</Text>
                </View>
                {!session.current && (
                  <TouchableOpacity style={styles.terminateButton} onPress={() => terminateSession(session.id)}>
                    <Icon name="log-out" size={16} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

  // Security log modal
  const SecurityLogModal = () => (
    <Modal
      visible={showSecurityLogModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSecurityLogModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Security Log</Text>
            <TouchableOpacity onPress={() => setShowSecurityLogModal(false)} style={styles.closeButton}>
              <Icon name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {securityLog.map((log) => (
              <View key={log.id} style={styles.logItem}>
                <View style={styles.logHeader}>
                  <Text style={styles.logAction}>{log.action}</Text>
                  <View
                    style={[
                      styles.logStatusBadge,
                      { backgroundColor: log.status === "success" ? "#22c55e" : "#ef4444" },
                    ]}
                  >
                    <Text style={styles.logStatusText}>{log.status}</Text>
                  </View>
                </View>
                <Text style={styles.logDevice}>{log.device}</Text>
                <Text style={styles.logLocation}>{log.location}</Text>
                <Text style={styles.logTimestamp}>{log.timestamp}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

  return (
    <GradientView colors={["#ff9a9e", "#fecfef", "#fecfef"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Icon name="shield" size={24} color="#fff" />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Security Settings</Text>
              <Text style={styles.headerSubtitle}>Manage your account security and authentication</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Password Management Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="key" size={20} color="#fff" />
            <Text style={styles.sectionTitle}>Password Management</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your current password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry={!passwordVisible}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={togglePasswordVisibility}>
                <Icon name={passwordVisible ? "eye-off" : "eye"} size={18} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter a new password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry={!newPasswordVisible}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={toggleNewPasswordVisibility}>
                <Icon name={newPasswordVisible ? "eye-off" : "eye"} size={18} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Confirm your new password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <RequirementIndicator met={passwordRequirements.length} text="At least 8 characters long" />
            <RequirementIndicator
              met={passwordRequirements.uppercase && passwordRequirements.lowercase}
              text="Contains uppercase and lowercase letters"
            />
            <RequirementIndicator met={passwordRequirements.number} text="Contains at least one number" />
            <RequirementIndicator met={passwordRequirements.special} text="Contains at least one special character" />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handlePasswordSave}>
            <Icon name="save" size={16} color="#fff" />
            <Text style={styles.saveButtonText}>Update Password</Text>
          </TouchableOpacity>
        </View>

        {/* Two-Factor Authentication Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="smartphone" size={20} color="#fff" />
            <Text style={styles.sectionTitle}>Two-Factor Authentication</Text>
          </View>

          <View style={styles.toggleContainer}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Enable Two-Factor Authentication</Text>
              <Text style={styles.toggleDescription}>Add an extra layer of security to your account</Text>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: "rgba(255,255,255,0.2)", true: "#22c55e" }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: twoFactorEnabled ? "#22c55e" : "#ef4444" }]} />
            <Text style={styles.statusText}>
              Two-Factor Authentication is {twoFactorEnabled ? "Enabled" : "Disabled"}
            </Text>
          </View>

          {twoFactorEnabled ? (
            <View style={styles.twoFactorContent}>
              <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>How it works:</Text>
                <Text style={styles.infoText}>
                  Two-factor authentication adds an extra layer of security to your account. You'll need to enter a code
                  from your authenticator app in addition to your password when signing in.
                </Text>
                <View style={styles.stepsList}>
                  <Text style={styles.stepText}>
                    • Download an authenticator app (Google Authenticator, Authy, etc.)
                  </Text>
                  <Text style={styles.stepText}>• Scan the QR code or enter the setup key</Text>
                  <Text style={styles.stepText}>• Enter the 6-digit code to verify setup</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.setupButton} onPress={handleTwoFactorSetup}>
                <Icon name="lock" size={16} color="#fff" />
                <Text style={styles.setupButtonText}>Set Up Two-Factor Authentication</Text>
              </TouchableOpacity>

              <View style={styles.backupCodesSection}>
                <Text style={styles.backupCodesTitle}>Backup Codes</Text>
                <Text style={styles.backupCodesDescription}>
                  Save these backup codes in a safe place. You can use them to access your account if you lose your
                  authenticator device.
                </Text>
                <TouchableOpacity style={styles.backupCodesButton} onPress={() => setShowBackupCodesModal(true)}>
                  <Text style={styles.backupCodesButtonText}>View Backup Codes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                <Text style={styles.warningBold}>Security Recommendation:</Text> Enable two-factor authentication to
                significantly improve your account security.
              </Text>
            </View>
          )}
        </View>

        {/* Additional Security Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="shield" size={20} color="#fff" />
            <Text style={styles.sectionTitle}>Additional Security</Text>
          </View>

          <View style={styles.securityGrid}>
            <View style={styles.securityCard}>
              <Text style={styles.securityCardTitle}>Login Notifications</Text>
              <Text style={styles.securityCardDescription}>Get notified when someone logs into your account</Text>
              <Switch
                value={loginNotifications}
                onValueChange={setLoginNotifications}
                trackColor={{ false: "rgba(255,255,255,0.2)", true: "#22c55e" }}
                thumbColor="#fff"
                style={styles.securityCardSwitch}
              />
            </View>

            <View style={styles.securityCard}>
              <Text style={styles.securityCardTitle}>Email Notifications</Text>
              <Text style={styles.securityCardDescription}>Receive security alerts via email</Text>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: "rgba(255,255,255,0.2)", true: "#22c55e" }}
                thumbColor="#fff"
                style={styles.securityCardSwitch}
              />
            </View>

            <TouchableOpacity style={styles.securityCard} onPress={() => setShowSessionsModal(true)}>
              <Text style={styles.securityCardTitle}>Active Sessions</Text>
              <Text style={styles.securityCardDescription}>Manage devices that are currently logged in</Text>
              <View style={styles.securityCardButton}>
                <Text style={styles.securityCardButtonText}>View Sessions</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.securityCard} onPress={() => setShowSecurityLogModal(true)}>
              <Text style={styles.securityCardTitle}>Security Log</Text>
              <Text style={styles.securityCardDescription}>Review recent security-related activities</Text>
              <View style={styles.securityCardButton}>
                <Text style={styles.securityCardButtonText}>View Log</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <BackupCodesModal />
      <SessionsModal />
      <SecurityLogModal />
    </GradientView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginTop: 2,
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
  },
  requirementsContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 15,
    marginBottom: 20,
  },
  requirementsTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  requirementText: {
    fontSize: 14,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: "#ff9a9e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 15,
  },
  toggleTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  toggleDescription: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 15,
    marginBottom: 20,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  twoFactorContent: {
    gap: 15,
  },
  infoContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 15,
  },
  infoTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  infoText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  stepsList: {
    gap: 5,
  },
  stepText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  setupButton: {
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  setupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backupCodesSection: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 15,
  },
  backupCodesTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  backupCodesDescription: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  backupCodesButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  backupCodesButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  warningContainer: {
    backgroundColor: "rgba(234, 179, 8, 0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(234, 179, 8, 0.3)",
    padding: 15,
  },
  warningText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    lineHeight: 20,
  },
  warningBold: {
    fontWeight: "bold",
  },
  securityGrid: {
    gap: 15,
  },
  securityCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 15,
  },
  securityCardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  securityCardDescription: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 10,
  },
  securityCardSwitch: {
    alignSelf: "flex-start",
  },
  securityCardButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  securityCardButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#ff9a9e",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    width: "100%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  backupCodesContainer: {
    gap: 10,
    marginVertical: 20,
  },
  backupCodeItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 15,
    alignItems: "center",
  },
  backupCodeText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  generateCodesButton: {
    backgroundColor: "#ff9a9e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 10,
  },
  generateCodesText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sessionItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sessionInfo: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  sessionDevice: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },
  currentSessionBadge: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  currentSessionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  sessionLocation: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 2,
  },
  sessionLastActive: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },
  terminateButton: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    padding: 10,
    borderRadius: 8,
  },
  logItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 15,
    marginBottom: 15,
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  logAction: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  logStatusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  logDevice: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 2,
  },
  logLocation: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 2,
  },
  logTimestamp: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },
})

export default SettingsScreen