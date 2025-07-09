"use client"

import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native"
import { Phone, PhoneCall, PhoneOff } from "lucide-react-native"
import { useState } from "react"
import { THEME } from "../styles/globalStyles"

const CallInterface = ({
  callStatus,
  callData,
  onInitiateCall,
  onAnswerCall,
  onEndCall,
  personalitySettings,
  disabled,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleInitiateCall = () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter a phone number")
      return
    }
    onInitiateCall(phoneNumber)
  }

  const getStatusColor = () => {
    switch (callStatus) {
      case "connecting":
        return THEME.warning
      case "in-progress":
        return THEME.success
      case "ended":
        return THEME.error
      default:
        return THEME.textLight
    }
  }

  const getStatusText = () => {
    switch (callStatus) {
      case "idle":
        return "Ready to call"
      case "connecting":
        return "Connecting..."
      case "ringing":
        return "Incoming call"
      case "in-progress":
        return "Call in progress"
      case "ended":
        return "Call ended"
      default:
        return "Unknown status"
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Phone size={24} color={THEME.text} />
        <Text style={styles.title}>Voice Call Interface</Text>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      {callData && (
        <View style={styles.callInfo}>
          <Text style={styles.callInfoText}>
            {callData.direction === "incoming" ? "From: " : "To: "}
            {callData.direction === "incoming" ? callData.from : callData.to}
          </Text>
          {callData.callSid && <Text style={styles.callSid}>Call ID: {callData.callSid.substring(0, 8)}...</Text>}
        </View>
      )}

      {callStatus === "idle" && (
        <View style={styles.dialContainer}>
          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter phone number"
            placeholderTextColor={THEME.textLight}
            keyboardType="phone-pad"
            editable={!disabled}
          />
          <TouchableOpacity
            style={[styles.callButton, styles.initiateButton, disabled && styles.disabledButton]}
            onPress={handleInitiateCall}
            disabled={disabled || !phoneNumber.trim()}
          >
            <PhoneCall size={20} color={THEME.text} />
            <Text style={styles.buttonText}>Start Call</Text>
          </TouchableOpacity>
        </View>
      )}

      {callStatus === "ringing" && (
        <View style={styles.callActions}>
          <TouchableOpacity style={[styles.callButton, styles.answerButton]} onPress={onAnswerCall}>
            <Phone size={20} color={THEME.text} />
            <Text style={styles.buttonText}>Answer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.callButton, styles.endButton]} onPress={onEndCall}>
            <PhoneOff size={20} color={THEME.text} />
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}

      {(callStatus === "connecting" || callStatus === "in-progress") && (
        <TouchableOpacity style={[styles.callButton, styles.endButton]} onPress={onEndCall}>
          <PhoneOff size={20} color={THEME.text} />
          <Text style={styles.buttonText}>End Call</Text>
        </TouchableOpacity>
      )}

      {personalitySettings && (
        <View style={styles.personalityPreview}>
          <Text style={styles.personalityTitle}>Active Personality Settings:</Text>
          <View style={styles.personalityGrid}>
            {Object.entries(personalitySettings).map(([trait, value]) => (
              <View key={trait} style={styles.personalityItem}>
                <Text style={styles.personalityTrait}>{trait}</Text>
                <Text style={styles.personalityValue}>{value}%</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.text,
    marginLeft: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: "500",
  },
  callInfo: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  callInfoText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  callSid: {
    color: THEME.textLight,
    fontSize: 12,
  },
  dialContainer: {
    marginBottom: 20,
  },
  phoneInput: {
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
  callActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 120,
  },
  initiateButton: {
    backgroundColor: THEME.success,
  },
  answerButton: {
    backgroundColor: THEME.success,
  },
  endButton: {
    backgroundColor: THEME.error,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  personalityPreview: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
  },
  personalityTitle: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  personalityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  personalityItem: {
    width: "50%",
    marginBottom: 8,
  },
  personalityTrait: {
    color: THEME.textLight,
    fontSize: 12,
  },
  personalityValue: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "500",
  },
})

export default CallInterface
