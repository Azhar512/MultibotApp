
import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Modal,
  Alert,
  Dimensions,
  RefreshControl,
} from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import { Picker } from "@react-native-picker/picker"
import {
  Search,
  Download,
  Printer,
  RefreshCw,
  Flag,
  Archive,
  Trash2,
  ChevronRight,
  Bell,
  Menu,
  User,
  Bot,
  X,
} from "lucide-react-native"
import { THEME } from "../styles/globalStyles"
import Card from "../components/Card"
import DatePicker from "../components/DatePicker"
import Sidebar from "../components/Sidebar"

const { width, height } = Dimensions.get("window")

const InteractionLogScreen = ({ navigation }) => {
  // State Management
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedUser, setSelectedUser] = useState("all")
  const [selectedSentiment, setSelectedSentiment] = useState("all")
  const [selectedInteraction, setSelectedInteraction] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [interactions, setInteractions] = useState([])
  const [filteredInteractions, setFilteredInteractions] = useState([])
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeUsers: 12,
    recentInteractions: 45,
    sentimentDistribution: { positive: 60, neutral: 30, negative: 10 },
    averageResponseTime: 1250,
  })
  const [isConnected, setIsConnected] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [detailsModalVisible, setDetailsModalVisible] = useState(false)

  // Mock data
  const mockInteractions = [
    {
      id: "1",
      timestamp: new Date().toISOString(),
      userName: "John Doe",
      userMessage: "Hello, I need help with my account settings",
      botResponse:
        "I'd be happy to help you with your account settings. What specific aspect would you like to modify?",
      sentiment: "positive",
      userId: "user123",
      responseTime: 1200,
      confidence: 0.95,
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      userName: "Jane Smith",
      userMessage: "This service is not working properly",
      botResponse: "I apologize for the inconvenience. Let me help you troubleshoot the issue.",
      sentiment: "negative",
      userId: "user456",
      responseTime: 800,
      confidence: 0.88,
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      userName: "Mike Johnson",
      userMessage: "Can you explain how the pricing works?",
      botResponse: "Our pricing is based on usage tiers. Let me break down the different plans for you.",
      sentiment: "neutral",
      userId: "user789",
      responseTime: 1500,
      confidence: 0.92,
    },
  ]

  const users = [
    { label: "All Users", value: "all" },
    { label: "John Doe", value: "user123" },
    { label: "Jane Smith", value: "user456" },
    { label: "Mike Johnson", value: "user789" },
  ]

  const sentiments = [
    { label: "All Sentiments", value: "all" },
    { label: "Positive", value: "positive" },
    { label: "Neutral", value: "neutral" },
    { label: "Negative", value: "negative" },
  ]

  const navItems = [
    { icon: Menu, label: "Dashboard", screen: "Dashboard" },
    { icon: Bot, label: "Bot Interaction", screen: "BotInteraction" },
    { icon: Archive, label: "Interaction Log", screen: "InteractionLog" },
    { icon: Menu, label: "Settings", screen: "Settings" },
  ]

  // Initialize mock data
  useEffect(() => {
    setInteractions(mockInteractions)
    setFilteredInteractions(mockInteractions)
  }, [])

  // Filter interactions based on search and filters
  useEffect(() => {
    let filtered = interactions

    if (searchQuery) {
      filtered = filtered.filter(
        (interaction) =>
          interaction.userMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
          interaction.botResponse.toLowerCase().includes(searchQuery.toLowerCase()) ||
          interaction.userName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedUser !== "all") {
      filtered = filtered.filter((interaction) => interaction.userId === selectedUser)
    }

    if (selectedSentiment !== "all") {
      filtered = filtered.filter((interaction) => interaction.sentiment === selectedSentiment)
    }

    if (startDate) {
      filtered = filtered.filter((interaction) => new Date(interaction.timestamp) >= new Date(startDate))
    }

    if (endDate) {
      filtered = filtered.filter((interaction) => new Date(interaction.timestamp) <= new Date(endDate))
    }

    setFilteredInteractions(filtered)
    setCurrentPage(1)
  }, [searchQuery, selectedUser, selectedSentiment, startDate, endDate, interactions])

  const handleSearch = (text) => {
    setSearchQuery(text)
  }

  const handleReset = () => {
    setSearchQuery("")
    setStartDate("")
    setEndDate("")
    setSelectedUser("all")
    setSelectedSentiment("all")
    Alert.alert("Success", "Filters have been reset")
  }

  const handleStatusUpdate = (id, status) => {
    Alert.alert("Confirm Action", `Are you sure you want to ${status} this interaction?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: () => {
          // Update interaction status
          setInteractions((prev) =>
            prev.map((interaction) => (interaction.id === id ? { ...interaction, status } : interaction)),
          )
          Alert.alert("Success", `Interaction has been ${status}`)
          setDetailsModalVisible(false)
        },
      },
    ])
  }

  const handleExport = (format) => {
    Alert.alert("Export", `Exporting data in ${format.toUpperCase()} format...`)
  }

  const onRefresh = () => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false)
      Alert.alert("Success", "Data refreshed successfully")
    }, 1000)
  }

  const openInteractionDetails = (interaction) => {
    setSelectedInteraction(interaction)
    setDetailsModalVisible(true)
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarOpen(true)}>
        <Menu size={24} color={THEME.text} />
      </TouchableOpacity>

      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Interaction Log</Text>
      </View>

      <View style={styles.headerActions}>
        <View style={[styles.connectionStatus, isConnected ? styles.connected : styles.disconnected]}>
          <RefreshCw size={12} color={THEME.text} style={isConnected ? styles.spinning : null} />
          <Text style={styles.connectionText}>{isConnected ? "Live" : "Reconnecting..."}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={20} color={THEME.text} />
        </TouchableOpacity>
        <View style={styles.userProfile}>
          <LinearGradient colors={["#f97316", "#ec4899"]} style={styles.avatar} />
          <Text style={styles.userName}>Azhar</Text>
          <ChevronRight size={16} color={THEME.text} />
        </View>
      </View>
    </View>
  )

  const renderMetrics = () => (
    <View style={styles.metricsContainer}>
      <Card isSettingsCard>
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Active Users</Text>
            <Text style={styles.metricValue}>{realTimeMetrics.activeUsers}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Recent Interactions</Text>
            <Text style={styles.metricValue}>{realTimeMetrics.recentInteractions}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Avg Response Time</Text>
            <Text style={styles.metricValue}>{realTimeMetrics.averageResponseTime}ms</Text>
          </View>
        </View>
      </Card>
    </View>
  )

  const renderFilters = () => (
    <Card isSettingsCard>
      <View style={styles.filtersContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={16} color={THEME.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search interactions..."
            placeholderTextColor={THEME.textLight}
          />
        </View>

        {/* Date Filters */}
        <View style={styles.dateFilters}>
          <DatePicker
            value={startDate}
            onValueChange={setStartDate}
            placeholder="Start Date"
            style={styles.datePicker}
          />
          <DatePicker value={endDate} onValueChange={setEndDate} placeholder="End Date" style={styles.datePicker} />
        </View>

        {/* Dropdown Filters */}
        <View style={styles.dropdownFilters}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedUser}
              onValueChange={setSelectedUser}
              style={styles.picker}
              dropdownIconColor={THEME.text}
            >
              {users.map((user) => (
                <Picker.Item key={user.value} label={user.label} value={user.value} color={THEME.text} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedSentiment}
              onValueChange={setSelectedSentiment}
              style={styles.picker}
              dropdownIconColor={THEME.text}
            >
              {sentiments.map((sentiment) => (
                <Picker.Item key={sentiment.value} label={sentiment.label} value={sentiment.value} color={THEME.text} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <RefreshCw size={16} color={THEME.text} />
          <Text style={styles.resetButtonText}>Reset Filters</Text>
        </TouchableOpacity>
      </View>
    </Card>
  )

  const renderInteractionItem = ({ item }) => {
    const getSentimentColor = (sentiment) => {
      switch (sentiment) {
        case "positive":
          return { bg: "rgba(74, 222, 128, 0.2)", border: "rgba(74, 222, 128, 0.3)", text: THEME.success }
        case "negative":
          return { bg: "rgba(248, 113, 113, 0.2)", border: "rgba(248, 113, 113, 0.3)", text: THEME.error }
        default:
          return { bg: "rgba(251, 191, 36, 0.2)", border: "rgba(251, 191, 36, 0.3)", text: THEME.warning }
      }
    }

    const sentimentStyle = getSentimentColor(item.sentiment)

    return (
      <TouchableOpacity style={styles.interactionItem} onPress={() => openInteractionDetails(item)}>
        <View style={styles.interactionHeader}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitial}>{item.userName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{item.userName}</Text>
              <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
            </View>
          </View>
          <View
            style={[styles.sentimentBadge, { backgroundColor: sentimentStyle.bg, borderColor: sentimentStyle.border }]}
          >
            <Text style={[styles.sentimentText, { color: sentimentStyle.text }]}>{item.sentiment}</Text>
          </View>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>User:</Text>
          <Text style={styles.messageText} numberOfLines={2}>
            {item.userMessage}
          </Text>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>Bot:</Text>
          <Text style={styles.messageText} numberOfLines={2}>
            {item.botResponse}
          </Text>
        </View>

        <View style={styles.interactionFooter}>
          <Text style={styles.responseTime}>Response: {item.responseTime}ms</Text>
          <Text style={styles.confidence}>Confidence: {Math.round(item.confidence * 100)}%</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderInteractionsList = () => (
    <Card isSettingsCard>
      <Text style={styles.sectionTitle}>Interactions ({filteredInteractions.length})</Text>
      <FlatList
        data={filteredInteractions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
        renderItem={renderInteractionItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.text} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Archive size={48} color={THEME.textLight} />
            <Text style={styles.emptyText}>No interactions found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        }
      />
    </Card>
  )

  const renderDetailsModal = () => (
    <Modal visible={detailsModalVisible} animationType="slide" presentationStyle="pageSheet">
      <LinearGradient colors={THEME.background} style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Interaction Details</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => setDetailsModalVisible(false)}>
            <X size={24} color={THEME.text} />
          </TouchableOpacity>
        </View>

        {selectedInteraction && (
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* User Message */}
            <View style={styles.messageDetailContainer}>
              <View style={styles.messageDetailHeader}>
                <User size={20} color={THEME.text} />
                <Text style={styles.messageDetailSender}>{selectedInteraction.userName}</Text>
                <Text style={styles.messageDetailTime}>{new Date(selectedInteraction.timestamp).toLocaleString()}</Text>
              </View>
              <View style={styles.messageDetailBubble}>
                <Text style={styles.messageDetailText}>{selectedInteraction.userMessage}</Text>
              </View>
            </View>

            {/* Bot Response */}
            <View style={styles.messageDetailContainer}>
              <View style={styles.messageDetailHeader}>
                <Bot size={20} color={THEME.text} />
                <Text style={styles.messageDetailSender}>AI Bot</Text>
                <Text style={styles.messageDetailTime}>Response Time: {selectedInteraction.responseTime}ms</Text>
              </View>
              <View style={[styles.messageDetailBubble, styles.botBubble]}>
                <Text style={styles.messageDetailText}>{selectedInteraction.botResponse}</Text>
              </View>
            </View>

            {/* Metadata */}
            <View style={styles.metadataContainer}>
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Sentiment:</Text>
                <Text style={[styles.metadataValue, { color: THEME.success }]}>{selectedInteraction.sentiment}</Text>
              </View>
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Confidence:</Text>
                <Text style={styles.metadataValue}>{Math.round(selectedInteraction.confidence * 100)}%</Text>
              </View>
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>User ID:</Text>
                <Text style={styles.metadataValue}>{selectedInteraction.userId}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.flagButton]}
                onPress={() => handleStatusUpdate(selectedInteraction.id, "flagged")}
              >
                <Flag size={16} color={THEME.text} />
                <Text style={styles.actionButtonText}>Flag</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.archiveButton]}
                onPress={() => handleStatusUpdate(selectedInteraction.id, "archived")}
              >
                <Archive size={16} color={THEME.text} />
                <Text style={styles.actionButtonText}>Archive</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleStatusUpdate(selectedInteraction.id, "deleted")}
              >
                <Trash2 size={16} color={THEME.text} />
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </LinearGradient>
    </Modal>
  )

  const renderFooter = () => (
    <Card isSettingsCard>
      <View style={styles.footerContainer}>
        {/* Export Options */}
        <View style={styles.exportButtons}>
          <TouchableOpacity style={styles.exportButton} onPress={() => handleExport("csv")}>
            <Download size={16} color={THEME.text} />
            <Text style={styles.exportButtonText}>Export CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton} onPress={() => handleExport("print")}>
            <Printer size={16} color={THEME.text} />
            <Text style={styles.exportButtonText}>Print</Text>
          </TouchableOpacity>
        </View>

        {/* Pagination */}
        <View style={styles.paginationContainer}>
          <View style={styles.itemsPerPageContainer}>
            <Text style={styles.paginationLabel}>Items per page:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={itemsPerPage}
                onValueChange={setItemsPerPage}
                style={styles.smallPicker}
                dropdownIconColor={THEME.text}
              >
                <Picker.Item label="10" value={10} color={THEME.text} />
                <Picker.Item label="20" value={20} color={THEME.text} />
                <Picker.Item label="50" value={50} color={THEME.text} />
              </Picker>
            </View>
          </View>

          <View style={styles.paginationControls}>
            <TouchableOpacity
              style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
              onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <Text style={styles.paginationButtonText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.pageInfo}>Page {currentPage}</Text>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage >= Math.ceil(filteredInteractions.length / itemsPerPage) && styles.disabledButton,
              ]}
              onPress={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage >= Math.ceil(filteredInteractions.length / itemsPerPage)}
            >
              <Text style={styles.paginationButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  )

  return (
    <LinearGradient colors={THEME.background} style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderMetrics()}
        {renderFilters()}
        {renderInteractionsList()}
        {renderFooter()}
      </ScrollView>

      {renderDetailsModal()}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
        navigation={navigation}
        currentScreen="InteractionLog"
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
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
    fontSize: 24,
    fontWeight: "bold",
    color: THEME.text,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
  },
  connected: {
    backgroundColor: "rgba(74, 222, 128, 0.2)",
    borderColor: "rgba(74, 222, 128, 0.3)",
  },
  disconnected: {
    backgroundColor: "rgba(248, 113, 113, 0.2)",
    borderColor: "rgba(248, 113, 113, 0.3)",
  },
  connectionText: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: "500",
  },
  spinning: {
    // Add animation if needed
  },
  notificationButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
  metricsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  metricItem: {
    alignItems: "center",
  },
  metricLabel: {
    color: THEME.textLight,
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  metricValue: {
    color: THEME.text,
    fontSize: 24,
    fontWeight: "bold",
  },
  filtersContainer: {
    gap: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: THEME.text,
    fontSize: 16,
    paddingVertical: 12,
  },
  dateFilters: {
    flexDirection: "row",
    gap: 12,
  },
  datePicker: {
    flex: 1,
  },
  dropdownFilters: {
    flexDirection: "row",
    gap: 12,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  picker: {
    color: THEME.text,
    height: 50,
  },
  smallPicker: {
    color: THEME.text,
    height: 40,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    alignSelf: "flex-end",
  },
  resetButtonText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 16,
  },
  interactionItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  interactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userInitial: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
  },
  timestamp: {
    color: THEME.textLight,
    fontSize: 12,
  },
  sentimentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  sentimentText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  messageContainer: {
    marginBottom: 8,
  },
  messageLabel: {
    color: THEME.textLight,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  messageText: {
    color: THEME.text,
    fontSize: 14,
    lineHeight: 20,
  },
  interactionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  responseTime: {
    color: THEME.textLight,
    fontSize: 10,
  },
  confidence: {
    color: THEME.textLight,
    fontSize: 10,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: THEME.textLight,
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    color: THEME.textLight,
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: THEME.text,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageDetailContainer: {
    marginBottom: 20,
  },
  messageDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  messageDetailSender: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  messageDetailTime: {
    color: THEME.textLight,
    fontSize: 10,
  },
  messageDetailBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  botBubble: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
  },
  messageDetailText: {
    color: THEME.text,
    fontSize: 14,
    lineHeight: 20,
  },
  metadataContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  metadataItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metadataLabel: {
    color: THEME.textLight,
    fontSize: 14,
  },
  metadataValue: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
  },
  flagButton: {
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    borderColor: "rgba(251, 191, 36, 0.3)",
  },
  archiveButton: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  deleteButton: {
    backgroundColor: "rgba(248, 113, 113, 0.2)",
    borderColor: "rgba(248, 113, 113, 0.3)",
  },
  actionButtonText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "500",
  },
  footerContainer: {
    gap: 20,
  },
  exportButtons: {
    flexDirection: "row",
    gap: 12,
  },
  exportButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  exportButtonText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "500",
  },
  paginationContainer: {
    gap: 16,
  },
  itemsPerPageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  paginationLabel: {
    color: THEME.text,
    fontSize: 14,
  },
  paginationControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  paginationButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  paginationButtonText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "500",
  },
  pageInfo: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "500",
  },
})

export default InteractionLogScreen
