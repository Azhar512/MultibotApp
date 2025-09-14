import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from "react-native"
import { X } from "lucide-react-native"
import { THEME } from "../styles/globalStyles"
import GradientView from "./GradientView"

const { width, height } = Dimensions.get("window")

const Sidebar = ({ isOpen, onClose, navItems, navigation, currentScreen }) => {
  const handleNavigation = (screen) => {
    navigation.navigate(screen)
    onClose()
  }

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sidebar}>
          {/* Pink/Coral gradient background matching your theme */}
          <GradientView colors={["#FF8A9B", "#FF9A9A"]} style={styles.sidebarGradient}>
            <View style={styles.sidebarContent}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>AI Bot Platform</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={THEME.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.nav}>
                {navItems.map((item, index) => {
                  const isActive = currentScreen === item.screen
                  return (
                    <TouchableOpacity key={index} style={styles.navItem} onPress={() => handleNavigation(item.screen)}>
                      <View style={[styles.navItemContent, isActive && styles.activeNavItem]}>
                        {isActive && <View style={styles.activeGradient} />}
                        <View style={styles.navItemInner}>
                          <item.icon size={20} color={isActive ? "#FF8A9B" : THEME.text} />
                          <Text style={[styles.navText, isActive && styles.activeNavText]}>{item.label}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>

              {/* Status indicator */}
              <View style={styles.statusContainer}>
                <View style={styles.statusBadge}>
                  <View style={styles.statusGradient} />
                </View>
              </View>
            </View>
          </GradientView>
        </View>
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
    overflow: "hidden",
  },
  sidebarGradient: {
    flex: 1,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 50,
    zIndex: 1,
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
    flex: 1,
  },
  navItem: {
    marginBottom: 8,
  },
  navItemContent: {
    borderRadius: 12,
    overflow: "hidden",
  },
  activeNavItem: {
    // Handled by activeGradient
  },
  activeGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  navItemInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    zIndex: 1,
  },
  navText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
    color: THEME.text,
  },
  activeNavText: {
    color: "#FF8A9B", // Pink color for active text
    fontWeight: "600",
  },
  statusContainer: {
    padding: 20,
    paddingTop: 0,
  },
  statusBadge: {
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statusGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  statusText: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: "500",
    padding: 10,
    zIndex: 1,
  },
})

export default Sidebar
