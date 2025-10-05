
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native"
import { useState } from "react"
import { THEME } from "../styles/globalStyles"

const PRESET_COLORS = [
  "#3b82f6",
  "#1e40af",
  "#8b5cf6",
  "#7c3aed",
  "#ec4899",
  "#be185d",
  "#f59e0b",
  "#d97706",
  "#10b981",
  "#059669",
  "#ef4444",
  "#dc2626",
  "#6b7280",
  "#374151",
  "#000000",
  "#ffffff",
]

const ColorPicker = ({ value, onValueChange, label }) => {
  const [modalVisible, setModalVisible] = useState(false)

  const handleColorSelect = (color) => {
    onValueChange(color)
    setModalVisible(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.colorButton} onPress={() => setModalVisible(true)}>
        <View style={[styles.colorPreview, { backgroundColor: value }]} />
        <Text style={styles.colorText}>{value}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Color</Text>
            <ScrollView contentContainerStyle={styles.colorGrid}>
              {PRESET_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorOption, { backgroundColor: color }]}
                  onPress={() => handleColorSelect(color)}
                >
                  {value === color && <View style={styles.selectedIndicator} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  colorButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    padding: 12,
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  colorText: {
    color: THEME.text,
    fontSize: 16,
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
    maxHeight: "80%",
  },
  modalTitle: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  closeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: "600",
  },
})

export default ColorPicker
