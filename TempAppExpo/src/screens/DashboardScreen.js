
import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  Bell,
  Menu,
  Bot,
  Link,
  Clock,
  Brain,
  PlaySquare,
  ChevronRight,
} from "lucide-react-native"
import { dashboardAPI } from "../services/api"
import { THEME } from "../styles/globalStyles"
import Card from "../components/Card"
import ChartCard from "../components/ChartCard"
import Sidebar from "../components/Sidebar"

const { width, height } = Dimensions.get("window")

const DashboardScreen = ({ navigation }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    interactionTrends: [],
    personalityEffectiveness: {},
    channelMetrics: [],
  })
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    fetchDashboardData()
    // WebSocket connection for real-time updates
    let ws
    try {
      ws = new WebSocket("ws://localhost:5000")
      ws.onmessage = (event) => {
        const newData = JSON.parse(event.data)
        if (newData.type === "statsUpdate") {
          updateStats(newData)
        }
      }
      ws.onerror = (error) => {
        console.log("WebSocket error:", error)
      }
    } catch (error) {
      console.log("WebSocket connection failed:", error)
    }

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const [statsData, trendsData, effectivenessData] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getInteractionTrends(),
        dashboardAPI.getPersonalityEffectiveness(),
      ])

      if (!statsData.success || !trendsData.success || !effectivenessData.success) {
        throw new Error("Failed to fetch dashboard data")
      }

      setDashboardData({
        stats: [
          {
            title: "Total Interactions",
            value: statsData.data.totalInteractions.toLocaleString(),
            change: `${((statsData.data.totalInteractions / statsData.data.previousPeriod.totalInteractions - 1) * 100).toFixed(1)}%`,
            icon: MessageSquare,
            color: THEME.primary,
          },
          {
            title: "Success Rate",
            value: `${statsData.data.successRate.toFixed(1)}%`,
            change: `${(statsData.data.successRate - statsData.data.previousPeriod.successRate).toFixed(1)}%`,
            icon: Bot,
            color: THEME.secondary,
          },
          {
            title: "Active Users",
            value: statsData.data.activeUsers.toLocaleString(),
            change: `${((statsData.data.activeUsers / statsData.data.previousPeriod.activeUsers - 1) * 100).toFixed(1)}%`,
            icon: Users,
            color: THEME.accent1,
          },
          {
            title: "Avg Response Time",
            value: `${(statsData.data.averageResponseTime / 1000).toFixed(2)}s`,
            change: `${((1 - statsData.data.averageResponseTime / statsData.data.previousPeriod.averageResponseTime) * 100).toFixed(1)}%`,
            icon: Clock,
            color: THEME.accent2,
          },
        ],
        interactionTrends: trendsData.data,
        personalityEffectiveness: effectivenessData.data,
        channelMetrics: [
          { name: "Chat", value: statsData.data.interactionsByType.chat || 0 },
          { name: "Email", value: statsData.data.interactionsByType.email || 0 },
          { name: "Voice", value: statsData.data.interactionsByType.voice || 0 },
          { name: "Appointment", value: statsData.data.interactionsByType.appointment || 0 },
        ],
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      Alert.alert("Error", "Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const updateStats = (newData) => {
    setDashboardData((prevData) => ({
      ...prevData,
      stats: prevData.stats.map((stat) => ({
        ...stat,
        value: newData[stat.title.toLowerCase().replace(" ", "_")] || stat.value,
      })),
    }))
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarOpen(true)}>
        <Menu size={24} color={THEME.text} />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>AI Bot Analytics</Text>
        <Text style={styles.headerSubtitle}>Monitor your AI bot performance and user interactions</Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={20} color={THEME.text} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.userProfile}>
          <LinearGradient colors={["#f97316", "#ec4899"]} style={styles.avatar} />
          <Text style={styles.userName}>Azhar</Text>
          <ChevronRight size={16} color={THEME.text} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderStats = () => (
    <View style={styles.statsContainer}>
      {dashboardData.stats.map((stat, index) => (
        <Card key={index} stat={stat} isStatsCard={true} />
      ))}
    </View>
  )

  const renderCharts = () => (
    <View style={styles.chartsContainer}>
      <ChartCard
        title="Interaction Trends"
        data={dashboardData.interactionTrends}
        type="line"
        style={styles.wideChart}
      />
      <ChartCard
        title="Channel Distribution"
        data={dashboardData.channelMetrics}
        type="pie"
        style={styles.smallChart}
      />
      <ChartCard
        title="Personality Effectiveness"
        data={Object.entries(dashboardData.personalityEffectiveness).map(([key, value]) => ({
          name: key,
          value,
        }))}
        type="bar"
        style={styles.smallChart}
      />
    </View>
  )

  if (isLoading) {
    return (
      <LinearGradient colors={THEME.background} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.text} />
          <Bot size={24} color={THEME.text} style={styles.loadingIcon} />
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={THEME.background} style={styles.container}>
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
    paddingVertical: 20,
    marginBottom: 20,
  },
  menuButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.textLight,
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
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.error,
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
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  wideChart: {
    marginBottom: 20,
  },
  smallChart: {
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIcon: {
    position: "absolute",
  },
})

export default DashboardScreen
