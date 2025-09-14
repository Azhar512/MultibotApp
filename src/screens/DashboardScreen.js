"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native"
import { useAuth } from "../context/AuthContext"
import {
  LayoutDashboard,
  Users,
  Settings,
  Bot,
  Link,
  Clock,
  Brain,
  PlaySquare,
  Bell,
  Menu,
  MessageSquare,
  ChevronRight,
} from "lucide-react-native"
import { THEME } from "../styles/globalStyles"
import Sidebar from "../components/Sidebar"
import GradientView from "../components/GradientView"

const { width, height } = Dimensions.get("window")

function DashboardScreen({ navigation }) {
  const { token, user, logout, isAuthenticated } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    interactionTrends: [],
    personalityEffectiveness: {},
    channelMetrics: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", screen: "Dashboard" },
    { icon: Bot, label: "Bot Interaction", screen: "BotInteraction" },
    { icon: Link, label: "Embed Options", screen: "EmbedOptions" },
    { icon: Clock, label: "Interaction Log", screen: "InteractionLog" },
    { icon: Brain, label: "Personality Settings", screen: "PersonalitySettings" },
    { icon: PlaySquare, label: "Scenario Panel", screen: "ScenarioPanel" },
    { icon: Users, label: "Users", screen: "Users" },
    { icon: Settings, label: "Settings", screen: "Settings" },
  ]

  const fetchDashboardData = async () => {
    if (!token) {
      setError("Not authenticated. Please log in.")
      setLoading(false)
      return
    }

    try {
      console.log("🚀 Fetching dashboard data...")

      // Using mock data
      setDashboardData({
        stats: [
          {
            title: "Total Interactions",
            value: "1,247",
            change: "+12.5%",
            icon: MessageSquare,
            color: THEME.accent1,
          },
          {
            title: "Success Rate",
            value: "94.2%",
            change: "+2.1%",
            icon: Bot,
            color: THEME.success,
          },
          {
            title: "Active Users",
            value: "856",
            change: "+8.3%",
            icon: Users,
            color: THEME.accent1,
          },
          {
            title: "Avg Response Time",
            value: "1.2s",
            change: "-5.4%",
            icon: Clock,
            color: THEME.error,
          },
        ],
        interactionTrends: [
          { date: "2024-01-01", interactions: 120 },
          { date: "2024-01-02", interactions: 150 },
          { date: "2024-01-03", interactions: 180 },
          { date: "2024-01-04", interactions: 160 },
          { date: "2024-01-05", interactions: 200 },
        ],
        personalityEffectiveness: {
          friendly: 85,
          professional: 92,
          casual: 78,
          formal: 88,
        },
        channelMetrics: [
          { name: "Chat", value: 450 },
          { name: "Email", value: 320 },
          { name: "Voice", value: 280 },
          { name: "Appointment", value: 197 },
        ],
      })
    } catch (err) {
      console.error("❌ Dashboard data fetch failed:", err)
      setError(err.message || "Failed to fetch dashboard data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchDashboardData()
    }
  }, [token])

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarOpen(true)}>
          <Menu size={24} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.userProfile}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitial}>{user?.name?.charAt(0) || "U"}</Text>
            </View>
            <Text style={styles.userName}>{user?.name || "User"}</Text>
            <ChevronRight size={16} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>AI Bot Analytics</Text>
        <Text style={styles.headerSubtitle}>Monitor your AI bot performance</Text>
      </View>
    </View>
  )

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        {dashboardData.stats.slice(0, 2).map((stat, index) => (
          <View key={index} style={styles.statsCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{stat.title}</Text>
              <View style={[styles.cardIcon, { backgroundColor: `${stat.color}40` }]}>
                <stat.icon size={16} color={stat.color} />
              </View>
            </View>
            <Text style={styles.cardValue}>{stat.value}</Text>
            <View style={styles.cardChange}>
              <Text style={[styles.changeText, { color: stat.change.startsWith("+") ? THEME.success : THEME.error }]}>
                {stat.change}
              </Text>
              <Text style={styles.changeLabel}> from last month</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.statsRow}>
        {dashboardData.stats.slice(2, 4).map((stat, index) => (
          <View key={index + 2} style={styles.statsCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{stat.title}</Text>
              <View style={[styles.cardIcon, { backgroundColor: `${stat.color}40` }]}>
                <stat.icon size={16} color={stat.color} />
              </View>
            </View>
            <Text style={styles.cardValue}>{stat.value}</Text>
            <View style={styles.cardChange}>
              <Text style={[styles.changeText, { color: stat.change.startsWith("+") ? THEME.success : THEME.error }]}>
                {stat.change}
              </Text>
              <Text style={styles.changeLabel}> from last month</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )

  const renderCharts = () => (
    <View style={styles.chartsContainer}>
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Interaction Trends</Text>
        <View style={styles.chartContent}>
          <Text style={styles.chartType}>LINE Chart</Text>
          <Text style={styles.chartInfo}>5 data points available</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Channel Distribution</Text>
        <View style={styles.chartContent}>
          <Text style={styles.chartType}>PIE Chart</Text>
          <Text style={styles.chartInfo}>4 channels available</Text>
        </View>
      </View>
    </View>
  )

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <GradientView colors={["#FF8A9B", "#FF9A9A"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.text} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </GradientView>
    )
  }

  if (error) {
    return (
      <GradientView colors={["#FF8A9B", "#FF9A9A"]} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDashboardData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </GradientView>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8A9B" />
      <GradientView colors={["#FF8A9B", "#FF9A9A"]} style={styles.backgroundGradient}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderHeader()}
          {renderStats()}
          {renderCharts()}
        </ScrollView>

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          navItems={navItems}
          navigation={navigation}
          currentScreen="Dashboard"
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
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  menuButton: {
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    marginRight: 15,
  },
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF9A56",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  userInitial: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  userName: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  headerContent: {
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.textLight,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statsCard: {
    width: (width - 50) / 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 12,
    color: THEME.textLight,
    fontWeight: "500",
    flex: 1,
  },
  cardIcon: {
    padding: 6,
    borderRadius: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 8,
  },
  cardChange: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  changeLabel: {
    fontSize: 12,
    color: THEME.textLight,
  },
  chartsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  chartCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 20,
  },
  chartContent: {
    alignItems: "center",
    paddingVertical: 40,
  },
  chartType: {
    fontSize: 16,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 10,
  },
  chartInfo: {
    fontSize: 14,
    color: THEME.textLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    color: THEME.text,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: THEME.text,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: THEME.text,
    fontWeight: "bold",
  },
})

export default DashboardScreen
