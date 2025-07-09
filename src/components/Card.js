import { View, Text, StyleSheet, Dimensions } from "react-native"
import LinearGradient from "react-native-linear-gradient"
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
        <LinearGradient colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]} style={styles.statsCard}>
          <View style={styles.header}>
            <Text style={styles.title}>{stat.title}</Text>
            <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
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
        </LinearGradient>
      </View>
    )
  }

  // Settings card for bot interaction
  if (isSettingsCard) {
    return (
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
        style={[styles.settingsCard, style]}
      >
        {title && <Text style={styles.settingsTitle}>{title}</Text>}
        {children}
      </LinearGradient>
    )
  }

  // Default card
  return <View style={[styles.defaultCard, style]}>{children}</View>
}

const styles = StyleSheet.create({
  // Stats card styles (existing)
  container: {
    width: (width - 60) / 2,
    marginBottom: 15,
    marginRight: 10,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
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
  // Settings card styles (new)
  settingsCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 15,
  },
  // Default card styles
  defaultCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
  },
})

export default Card
