import { View, Text, StyleSheet, Dimensions } from "react-native"
import { THEME } from "../styles/globalStyles"

const { width } = Dimensions.get("window")

const Card = ({
  children,
  style,
  // Stats card props
  stat = null,
  isStatsCard = false,
  // Settings card props
  isSettingsCard = false,
  title = "",
}) => {
  // Stats card for dashboard
  if (isStatsCard && stat) {
    const isPositive = Number.parseFloat(stat.change) >= 0

    return (
      <View style={[styles.container, style]}>
        <View style={styles.statsCard}>
          {/* Gradient effect using multiple layers */}
          <View style={styles.gradientLayer1} />
          <View style={styles.gradientLayer2} />

          <View style={styles.cardContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{stat.title}</Text>
              <View style={[styles.iconContainer, { backgroundColor: `${stat.color}30` }]}>
                <stat.icon size={20} color={stat.color} />
              </View>
            </View>
            <Text style={styles.value}>{stat.value}</Text>
            <View style={styles.changeContainer}>
              <View
                style={[
                  styles.changeBadge,
                  { backgroundColor: isPositive ? "rgba(74, 222, 128, 0.2)" : "rgba(248, 113, 113, 0.2)" },
                ]}
              >
                <Text style={[styles.changeText, { color: isPositive ? THEME.success : THEME.error }]}>
                  {stat.change}
                </Text>
              </View>
              <Text style={styles.changeLabel}>from last month</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  // Settings card for bot interaction
  if (isSettingsCard) {
    return (
      <View style={[styles.settingsCard, style]}>
        <View style={styles.settingsGradientLayer} />
        <View style={styles.cardContent}>
          {title && <Text style={styles.settingsTitle}>{title}</Text>}
          {children}
        </View>
      </View>
    )
  }

  // Default card
  return <View style={[styles.defaultCard, style]}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    width: (width - 60) / 2,
    marginBottom: 15,
    marginRight: 10,
  },
  statsCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
    // Enhanced shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  gradientLayer1: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  gradientLayer2: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  cardContent: {
    padding: 20,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 12,
    color: THEME.textLight,
    fontWeight: "500",
    flex: 1,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 10,
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  changeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  changeLabel: {
    fontSize: 10,
    color: THEME.textLight,
  },
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingsGradientLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 15,
  },
  defaultCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
  },
})

export default Card
