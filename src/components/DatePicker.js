
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from "react-native"
import { useState } from "react"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Calendar } from "lucide-react-native"
import { THEME } from "../styles/globalStyles"

const DatePicker = ({ value, onValueChange, placeholder, style }) => {
  const [showPicker, setShowPicker] = useState(false)
  const [date, setDate] = useState(value ? new Date(value) : new Date())

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowPicker(false)
    }

    if (selectedDate) {
      setDate(selectedDate)
      const formattedDate = selectedDate.toISOString().split("T")[0]
      onValueChange(formattedDate)
    }
  }

  const formatDisplayDate = (dateString) => {
    if (!dateString) return placeholder
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
        <Calendar size={16} color={THEME.textLight} />
        <Text style={styles.dateText}>{formatDisplayDate(value)}</Text>
      </TouchableOpacity>

      {showPicker && (
        <Modal transparent visible={showPicker} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                textColor={THEME.text}
              />
              {Platform.OS === "ios" && (
                <TouchableOpacity style={styles.doneButton} onPress={() => setShowPicker(false)}>
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  dateText: {
    color: THEME.text,
    fontSize: 14,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "rgba(139, 92, 246, 0.95)",
    borderRadius: 20,
    padding: 20,
    width: "90%",
  },
  doneButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    alignItems: "center",
  },
  doneButtonText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: "600",
  },
})

export default DatePicker
