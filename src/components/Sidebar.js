import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { X } from "lucide-react-native"
import { THEME } from "../styles/globalStyles"

const { width, height } = Dimensions.get("window")

const Sidebar = ({ isOpen, onClose, navItems, navigation, currentScreen }) => {
  const handleNavigation = (screen) => {
    navigation.navigate(screen)
    onClose()
  }

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <LinearGradient colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]} style={styles.sidebar}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>AI Bot Platform</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={THEME.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.nav}>
            {navItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.navItem, currentScreen === item.screen && styles.activeNavItem]}
                onPress={() => handleNavigation(item.screen)}
              >
                <item.icon size={20} color={currentScreen === item.screen ? THEME.primary : THEME.text} />
                <Text style={[styles.navText, currentScreen === item.screen && styles.activeNavText]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: width * 0.8,
    height: height,
    paddingTop: 50,
    borderRightWidth: 1,
    borderRightColor: "rgba(255, 255, 255, 0.2)",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: THEME.text,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  nav: {
    padding: 20,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 8,
  },
  activeNavItem: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  navText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
    color: THEME.text,
  },
  activeNavText: {
    color: THEME.primary,
  },
})

export default Sidebar
