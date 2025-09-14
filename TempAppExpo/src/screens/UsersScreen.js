
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import { LinearGradient } from 'expo-linear-gradient'
import Icon from "react-native-vector-icons/Feather"
import { THEME } from '../styles/globalStyles';
const { width } = Dimensions.get("window")

// Mock API functions (replace with actual API calls)
const API_BASE_URL = "http://localhost:5000/api"

const UsersScreen = () => {
  // State management
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [filters, setFilters] = useState({
    dateJoined: "",
    interactionFrequency: "",
    sentiment: "",
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
  })

  // Mock data for demonstration
  const mockUsers = [
    {
      _id: "507f1f77bcf86cd799439011",
      name: "John Doe",
      email: "john.doe@example.com",
      lastInteraction: new Date().toISOString(),
      interactionCount: 45,
      sentiment: 0.8,
      status: "active",
      dateJoined: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      avatar: null,
    },
    {
      _id: "507f1f77bcf86cd799439012",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      lastInteraction: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      interactionCount: 23,
      sentiment: 0.6,
      status: "active",
      dateJoined: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      avatar: null,
    },
    {
      _id: "507f1f77bcf86cd799439013",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      lastInteraction: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      interactionCount: 67,
      sentiment: 0.3,
      status: "banned",
      dateJoined: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      avatar: null,
    },
    {
      _id: "507f1f77bcf86cd799439014",
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      lastInteraction: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      interactionCount: 12,
      sentiment: 0.9,
      status: "active",
      dateJoined: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      avatar: null,
    },
    {
      _id: "507f1f77bcf86cd799439015",
      name: "David Brown",
      email: "david.brown@example.com",
      lastInteraction: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      interactionCount: 89,
      sentiment: 0.7,
      status: "active",
      dateJoined: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      avatar: null,
    },
  ]

  // Fetch users function
  const fetchUsers = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Filter users based on search term
      let filteredUsers = mockUsers
      if (searchTerm) {
        filteredUsers = mockUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user._id.includes(searchTerm),
        )
      }

      setUsers(filteredUsers)
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(filteredUsers.length / prev.itemsPerPage),
        total: filteredUsers.length,
      }))
      setError(null)
    } catch (err) {
      setError("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true)
    await fetchUsers()
    setRefreshing(false)
  }

  // User actions
  const handleBanUser = async (userId) => {
    Alert.alert("Ban User", "Are you sure you want to ban this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Ban",
        style: "destructive",
        onPress: async () => {
          try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500))
            setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, status: "banned" } : user)))
            Alert.alert("Success", "User banned successfully")
          } catch (error) {
            Alert.alert("Error", "Failed to ban user")
          }
        },
      },
    ])
  }

  const handleDeleteUser = async (userId) => {
    Alert.alert("Delete User", "Are you sure you want to delete this user? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500))
            setUsers((prev) => prev.filter((user) => user._id !== userId))
            Alert.alert("Success", "User deleted successfully")
          } catch (error) {
            Alert.alert("Error", "Failed to delete user")
          }
        },
      },
    ])
  }

  const handleSendMessage = async (userId) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      Alert.alert("Success", "Message sent successfully")
    } catch (error) {
      Alert.alert("Error", "Failed to send message")
    }
  }

  const handleExportData = async (userId) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      Alert.alert("Success", "User data exported successfully")
    } catch (error) {
      Alert.alert("Error", "Failed to export user data")
    }
  }

  // Sentiment indicator component
  const SentimentIndicator = ({ value }) => {
    let backgroundColor = "#ef4444"
    if (value >= 0.7) backgroundColor = "#22c55e"
    else if (value >= 0.4) backgroundColor = "#eab308"

    return (
      <View style={styles.sentimentContainer}>
        <View style={styles.sentimentBackground}>
          <View
            style={[
              styles.sentimentFill,
              {
                backgroundColor,
                width: `${value * 100}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.sentimentText}>{(value * 100).toFixed(0)}%</Text>
      </View>
    )
  }

  // User card component
  const UserCard = ({ user }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => {
        setSelectedUser(user)
        setShowUserModal(true)
      }}
    >
      <LinearGradient colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]} style={styles.userCardGradient}>
        <View style={styles.userCardHeader}>
          <View style={styles.userAvatar}>
            <Icon name="user" size={20} color="#fff" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: user.status === "active" ? "#22c55e" : "#ef4444" }]}>
            <Text style={styles.statusText}>{user.status}</Text>
          </View>
        </View>

        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Interactions</Text>
            <Text style={styles.statValue}>{user.interactionCount}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Last Active</Text>
            <Text style={styles.statValue}>{new Date(user.lastInteraction).toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.sentimentSection}>
          <Text style={styles.sentimentLabel}>Sentiment</Text>
          <SentimentIndicator value={user.sentiment} />
        </View>

        <View style={styles.userActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.messageButton]}
            onPress={() => handleSendMessage(user._id)}
          >
            <Icon name="message-square" size={16} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.banButton]} onPress={() => handleBanUser(user._id)}>
            <Icon name="slash" size={16} color="#eab308" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteUser(user._id)}
          >
            <Icon name="trash-2" size={16} color="#ef4444" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.exportButton]}
            onPress={() => handleExportData(user._id)}
          >
            <Icon name="download" size={16} color="#22c55e" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )

  // Filters modal
  const FiltersModal = () => (
    <Modal
      visible={showFiltersModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFiltersModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Users</Text>
            <TouchableOpacity onPress={() => setShowFiltersModal(false)} style={styles.closeButton}>
              <Icon name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Date Joined</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filters.dateJoined}
                  onValueChange={(value) => setFilters({ ...filters, dateJoined: value })}
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="All Time" value="" color="#fff" />
                  <Picker.Item label="Last 7 days" value="last7days" color="#fff" />
                  <Picker.Item label="Last 30 days" value="last30days" color="#fff" />
                  <Picker.Item label="Last 90 days" value="last90days" color="#fff" />
                </Picker>
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Interaction Frequency</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filters.interactionFrequency}
                  onValueChange={(value) => setFilters({ ...filters, interactionFrequency: value })}
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="All Frequencies" value="" color="#fff" />
                  <Picker.Item label="High" value="high" color="#fff" />
                  <Picker.Item label="Medium" value="medium" color="#fff" />
                  <Picker.Item label="Low" value="low" color="#fff" />
                </Picker>
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Sentiment</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filters.sentiment}
                  onValueChange={(value) => setFilters({ ...filters, sentiment: value })}
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="All Sentiments" value="" color="#fff" />
                  <Picker.Item label="Positive" value="positive" color="#fff" />
                  <Picker.Item label="Neutral" value="neutral" color="#fff" />
                  <Picker.Item label="Negative" value="negative" color="#fff" />
                </Picker>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => setFilters({ dateJoined: "", interactionFrequency: "", sentiment: "" })}
            >
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyFiltersButton}
              onPress={() => {
                setShowFiltersModal(false)
                fetchUsers()
              }}
            >
              <Text style={styles.applyFiltersText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

  // User detail modal
  const UserDetailModal = () => (
    <Modal
      visible={showUserModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowUserModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>User Profile</Text>
            <TouchableOpacity onPress={() => setShowUserModal(false)} style={styles.closeButton}>
              <Icon name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {selectedUser && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.profileSection}>
                <View style={styles.profileHeader}>
                  <View style={styles.profileAvatar}>
                    <Icon name="user" size={30} color="#fff" />
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{selectedUser.name}</Text>
                    <Text style={styles.profileEmail}>{selectedUser.email}</Text>
                    <View
                      style={[
                        styles.profileStatus,
                        { backgroundColor: selectedUser.status === "active" ? "#22c55e" : "#ef4444" },
                      ]}
                    >
                      <Text style={styles.profileStatusText}>{selectedUser.status}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Profile Information</Text>
                <View style={styles.detailGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>User ID</Text>
                    <Text style={styles.detailValue}>{selectedUser._id}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Date Joined</Text>
                    <Text style={styles.detailValue}>{new Date(selectedUser.dateJoined).toLocaleDateString()}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Interaction Summary</Text>
                <View style={styles.interactionStats}>
                  <View style={styles.interactionStat}>
                    <Text style={styles.interactionStatValue}>{selectedUser.interactionCount}</Text>
                    <Text style={styles.interactionStatLabel}>Total Interactions</Text>
                  </View>
                  <View style={styles.interactionStat}>
                    <Text style={styles.interactionStatValue}>
                      {new Date(selectedUser.lastInteraction).toLocaleDateString()}
                    </Text>
                    <Text style={styles.interactionStatLabel}>Last Interaction</Text>
                  </View>
                </View>
                <View style={styles.sentimentDetail}>
                  <Text style={styles.sentimentDetailLabel}>Sentiment Trend</Text>
                  <SentimentIndicator value={selectedUser.sentiment} />
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  )

  useEffect(() => {
    fetchUsers()
  }, [searchTerm])

  if (loading && !refreshing) {
    return (
      <LinearGradient colors={theme.gradients.primary} style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      </LinearGradient>
    )
  }

  if (error && !loading) {
    return (
      <LinearGradient colors={theme.gradients.primary} style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <Icon name="alert-circle" size={48} color="#fff" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={theme.gradients.primary} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Icon name="users" size={24} color="#fff" />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>User Management</Text>
              <Text style={styles.headerSubtitle}>View and manage users who interact with the bot</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="rgba(255,255,255,0.7)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, email, or user ID..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFiltersModal(true)}>
          <Icon name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Users List */}
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <UserCard user={item} />}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" colors={["#fff"]} />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Modals */}
      <FiltersModal />
      <UserDetailModal />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 15,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContent: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    marginVertical: 15,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "rgba(139, 69, 19, 0.8)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 12,
  },
  filterButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    padding: 12,
  },
  listContainer: {
    padding: 20,
  },
  userCard: {
    marginBottom: 15,
    borderRadius: 16,
    overflow: "hidden",
  },
  userCardGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
  },
  userCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  userEmail: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  userStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 2,
  },
  statValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sentimentSection: {
    marginBottom: 15,
  },
  sentimentLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 5,
  },
  sentimentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sentimentBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    marginRight: 10,
  },
  sentimentFill: {
    height: "100%",
    borderRadius: 4,
  },
  sentimentText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    minWidth: 35,
  },
  userActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  messageButton: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  banButton: {
    backgroundColor: "rgba(234, 179, 8, 0.2)",
    borderColor: "rgba(234, 179, 8, 0.3)",
  },
  deleteButton: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  exportButton: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "rgba(139, 69, 19, 0.95)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    width: "100%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  picker: {
    color: "#fff",
  },
  clearFiltersButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  clearFiltersText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  applyFiltersButton: {
    backgroundColor: "rgba(139, 69, 19, 0.8)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  applyFiltersText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  profileSection: {
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileEmail: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    marginBottom: 8,
  },
  profileStatus: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  profileStatusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  detailGrid: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  detailItem: {
    marginBottom: 15,
  },
  detailLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 5,
  },
  detailValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  interactionStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginBottom: 15,
  },
  interactionStat: {
    flex: 1,
    alignItems: "center",
  },
  interactionStatValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  interactionStatLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    textAlign: "center",
  },
  sentimentDetail: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  sentimentDetailLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
})

export default UsersScreen
