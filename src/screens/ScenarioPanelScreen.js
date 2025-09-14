import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Dimensions, FlatList } from "react-native"
import {
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  TrendingUp,
  BarChart3,
  DollarSign,
  Users,
  Building,
  Zap,
  Bell,
  Menu,
  Search,
  PlaySquare,
} from "lucide-react-native"
import { THEME } from "../styles/globalStyles"
import Card from "../components/Card"
import Sidebar from "../components/Sidebar"
import GradientView from "../components/GradientView"

const { width } = Dimensions.get("window")

const ScenarioPanelScreen = ({ navigation }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("assumptions")
  const [searchText, setSearchText] = useState("")

  const scenarios = [
    {
      id: 1,
      name: "Baseline",
      description: "Current trajectory with steady growth patterns",
      icon: TrendingUp,
      color: ["#3b82f6", "#06b6d4"],
      impact: "+5%",
      probability: "65%",
      details: "Assumes continued market stability and gradual economic growth",
    },
    {
      id: 2,
      name: "Optimistic",
      description: "Accelerated growth with favorable conditions",
      icon: BarChart3,
      color: ["#10b981", "#059669"],
      impact: "+15%",
      probability: "25%",
      details: "Strong consumer confidence and increased business investment",
    },
    {
      id: 3,
      name: "Pessimistic",
      description: "Economic downturn with reduced activity",
      icon: TrendingUp,
      color: ["#ef4444", "#f97316"],
      impact: "-8%",
      probability: "15%",
      details: "Market volatility and reduced consumer spending",
    },
    {
      id: 4,
      name: "Disruption",
      description: "Major industry shifts and technological changes",
      icon: Zap,
      color: ["#8b5cf6", "#ec4899"],
      impact: "±20%",
      probability: "10%",
      details: "Breakthrough innovations or regulatory changes",
    },
  ]

  const drivers = [
    {
      id: 1,
      name: "GDP Growth",
      icon: TrendingUp,
      value: "2.8%",
      trend: "up",
      description: "Annual economic growth rate",
    },
    {
      id: 2,
      name: "Inflation",
      icon: DollarSign,
      value: "3.2%",
      trend: "down",
      description: "Consumer price index change",
    },
    {
      id: 3,
      name: "Unemployment",
      icon: Users,
      value: "4.1%",
      trend: "stable",
      description: "Labor market participation rate",
    },
    {
      id: 4,
      name: "Interest Rates",
      icon: BarChart3,
      value: "5.25%",
      trend: "up",
      description: "Federal funds rate",
    },
    {
      id: 5,
      name: "Consumer Spending",
      icon: DollarSign,
      value: "$12.8T",
      trend: "up",
      description: "Total consumer expenditure",
    },
    {
      id: 6,
      name: "Business Investment",
      icon: Building,
      value: "$2.1T",
      trend: "stable",
      description: "Capital expenditure by businesses",
    },
  ]

  const assumptions = [
    {
      id: 1,
      title: "Economic Growth Rate",
      description: "Expected annual GDP growth between 2-4%",
      category: "Economic",
    },
    {
      id: 2,
      title: "Market Volatility",
      description: "Moderate fluctuations in key market indicators",
      category: "Market",
    },
    {
      id: 3,
      title: "Technology Adoption",
      description: "Accelerated digital transformation across industries",
      category: "Technology",
    },
    {
      id: 4,
      title: "Regulatory Environment",
      description: "Stable policy framework with gradual changes",
      category: "Regulatory",
    },
    {
      id: 5,
      title: "Consumer Behavior",
      description: "Shift towards sustainable and digital products",
      category: "Social",
    },
    {
      id: 6,
      title: "Global Trade",
      description: "Continued international commerce with regional variations",
      category: "Economic",
    },
  ]

  const impactMetrics = [
    {
      scenario: "Optimistic",
      revenue: "+15%",
      costs: "+8%",
      profit: "+25%",
      color: "#10b981",
    },
    {
      scenario: "Baseline",
      revenue: "+5%",
      costs: "+3%",
      profit: "+8%",
      color: "#3b82f6",
    },
    {
      scenario: "Pessimistic",
      revenue: "-8%",
      costs: "+2%",
      profit: "-18%",
      color: "#ef4444",
    },
    {
      scenario: "Disruption",
      revenue: "±20%",
      costs: "±15%",
      profit: "±35%",
      color: "#8b5cf6",
    },
  ]

  const tabs = [
    { id: "assumptions", label: "Key Assumptions" },
    { id: "scenarios", label: "Scenario Models" },
    { id: "impact", label: "Business Impact" },
  ]

  const navItems = [
    { icon: Menu, label: "Dashboard", screen: "Dashboard" },
    { icon: PlaySquare, label: "Scenario Panel", screen: "ScenarioPanel" },
    { icon: Menu, label: "Settings", screen: "Settings" },
  ]

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return "↗"
      case "down":
        return "↘"
      default:
        return "→"
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case "up":
        return "#10b981"
      case "down":
        return "#ef4444"
      default:
        return "#9ca3af"
    }
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarOpen(true)}>
        <Menu size={24} color="#ffffff" />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <Search size={16} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search scenarios..."
          placeholderTextColor="#9ca3af"
        />
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={20} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.userProfile}>
          <ChevronRight size={16} color="#ffffff" />
        </View>
      </View>
    </View>
  )

  const renderHeroSection = () => (
    <View style={styles.heroSection}>
      <Text style={styles.heroTitle}>Scenario Planning</Text>
      <Text style={styles.heroSubtitle}>
        Explore the potential impact of different economic conditions on your business with our advanced scenario
        modeling.
      </Text>
    </View>
  )

  const renderTabNavigation = () => (
    <View style={styles.tabContainer}>
      <View style={styles.tabNavigation}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderDriverItem = ({ item }) => (
    <View style={styles.driverCard}>
      <View style={styles.driverHeader}>
        <View style={styles.driverIconContainer}>
          <item.icon size={24} color="#ffffff" />
        </View>
        <View style={styles.driverTrend}>
          <Text style={[styles.trendIcon, { color: getTrendColor(item.trend) }]}>{getTrendIcon(item.trend)}</Text>
        </View>
      </View>
      <Text style={styles.driverName}>{item.name}</Text>
      <Text style={styles.driverValue}>{item.value}</Text>
      <Text style={styles.driverDescription}>{item.description}</Text>
    </View>
  )

  const renderScenarioItem = ({ item }) => (
    <TouchableOpacity style={styles.scenarioCard}>
      <GradientView colors={item.color} style={styles.scenarioGradient}>
        <View style={styles.scenarioHeader}>
          <View style={styles.scenarioIconContainer}>
            <item.icon size={28} color="#ffffff" />
          </View>
          <View style={styles.scenarioMetrics}>
            <Text style={styles.scenarioImpact}>{item.impact}</Text>
            <Text style={styles.scenarioProbability}>{item.probability}</Text>
          </View>
        </View>
        <Text style={styles.scenarioName}>{item.name}</Text>
        <Text style={styles.scenarioDescription}>{item.description}</Text>
        <Text style={styles.scenarioDetails}>{item.details}</Text>
      </GradientView>
    </TouchableOpacity>
  )

  const renderAssumptionItem = ({ item }) => (
    <View style={styles.assumptionCard}>
      <View style={styles.assumptionHeader}>
        <Text style={styles.assumptionTitle}>{item.title}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      <Text style={styles.assumptionDescription}>{item.description}</Text>
    </View>
  )

  const renderImpactMetric = ({ item }) => (
    <View style={styles.impactCard}>
      <Text style={styles.impactScenario}>{item.scenario}</Text>
      <View style={styles.impactMetrics}>
        <View style={styles.impactMetricItem}>
          <Text style={styles.impactLabel}>Revenue</Text>
          <Text style={[styles.impactValue, { color: item.color }]}>{item.revenue}</Text>
        </View>
        <View style={styles.impactMetricItem}>
          <Text style={styles.impactLabel}>Costs</Text>
          <Text style={[styles.impactValue, { color: item.color }]}>{item.costs}</Text>
        </View>
        <View style={styles.impactMetricItem}>
          <Text style={styles.impactLabel}>Profit</Text>
          <Text style={[styles.impactValue, { color: item.color }]}>{item.profit}</Text>
        </View>
      </View>
    </View>
  )

  const renderKeyDriversSection = () => (
    <Card isSettingsCard>
      <Text style={styles.sectionTitle}>Key Economic Drivers</Text>
      <Text style={styles.sectionSubtitle}>
        Monitor the variables that have the greatest influence on your business performance.
      </Text>
      <FlatList
        data={drivers}
        renderItem={renderDriverItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.driverRow}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </Card>
  )

  const renderScenariosSection = () => (
    <Card isSettingsCard>
      <Text style={styles.sectionTitle}>Scenario Models</Text>
      <Text style={styles.sectionSubtitle}>
        Analyze how your business may perform under different economic conditions.
      </Text>
      <FlatList
        data={scenarios}
        renderItem={renderScenarioItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </Card>
  )

  const renderAssumptionsTab = () => (
    <View style={styles.tabContent}>
      {renderKeyDriversSection()}
      {renderScenariosSection()}
      <Card isSettingsCard>
        <Text style={styles.sectionTitle}>Key Assumptions</Text>
        <Text style={styles.sectionSubtitle}>Fundamental assumptions underlying our scenario models.</Text>
        <FlatList
          data={assumptions}
          renderItem={renderAssumptionItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </Card>
    </View>
  )

  const renderScenariosTab = () => (
    <View style={styles.tabContent}>
      {renderKeyDriversSection()}
      {renderScenariosSection()}
      <Card isSettingsCard>
        <Text style={styles.sectionTitle}>Scenario Comparison</Text>
        <Text style={styles.sectionSubtitle}>Compare key metrics across different scenarios.</Text>
        <View style={styles.comparisonGrid}>
          {scenarios.map((scenario) => (
            <View key={scenario.id} style={styles.comparisonCard}>
              <GradientView colors={scenario.color} style={styles.comparisonHeader}>
                <scenario.icon size={20} color="#ffffff" />
                <Text style={styles.comparisonName}>{scenario.name}</Text>
              </GradientView>
              <View style={styles.comparisonMetrics}>
                <Text style={styles.comparisonImpact}>Impact: {scenario.impact}</Text>
                <Text style={styles.comparisonProbability}>Probability: {scenario.probability}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>
    </View>
  )

  const renderImpactTab = () => (
    <View style={styles.tabContent}>
      {renderKeyDriversSection()}
      <Card isSettingsCard>
        <Text style={styles.sectionTitle}>Business Impact Analysis</Text>
        <Text style={styles.sectionSubtitle}>Projected financial impact across different scenarios.</Text>
        <FlatList
          data={impactMetrics}
          renderItem={renderImpactMetric}
          keyExtractor={(item) => item.scenario}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </Card>
      <Card isSettingsCard>
        <Text style={styles.sectionTitle}>Risk Assessment</Text>
        <View style={styles.riskGrid}>
          <View style={styles.riskCard}>
            <Text style={styles.riskTitle}>Low Risk</Text>
            <Text style={styles.riskValue}>65%</Text>
            <Text style={styles.riskDescription}>Baseline scenario probability</Text>
          </View>
          <View style={styles.riskCard}>
            <Text style={styles.riskTitle}>Medium Risk</Text>
            <Text style={styles.riskValue}>25%</Text>
            <Text style={styles.riskDescription}>Optimistic scenario probability</Text>
          </View>
          <View style={styles.riskCard}>
            <Text style={styles.riskTitle}>High Risk</Text>
            <Text style={styles.riskValue}>10%</Text>
            <Text style={styles.riskDescription}>Disruption scenario probability</Text>
          </View>
        </View>
      </Card>
    </View>
  )

  const renderFooter = () => (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <View style={styles.footerSection}>
          <Text style={styles.footerTitle}>Analytics Depot</Text>
          <Text style={styles.footerDescription}>
            Empowering businesses with advanced analytics and AI integration solutions.
          </Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity style={styles.socialLink}>
              <Github size={20} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLink}>
              <Twitter size={20} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLink}>
              <Linkedin size={20} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLink}>
              <Mail size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footerLinks}>
          <View style={styles.linkColumn}>
            <Text style={styles.linkColumnTitle}>Product</Text>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Features</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Integrations</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Enterprise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Solutions</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.linkColumn}>
            <Text style={styles.linkColumnTitle}>Resources</Text>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Documentation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>API Reference</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Community</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Blog</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.linkColumn}>
            <Text style={styles.linkColumnTitle}>Company</Text>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Careers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem}>
              <Text style={styles.linkText}>Legal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.footerBottom}>
        <Text style={styles.copyright}>© 2024 Analytics Depot. All rights reserved.</Text>
      </View>
    </View>
  )

  return (
    <GradientView colors={["#ff9a9e", "#fecfef", "#fecfef"]} style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderHeroSection()}
        {renderTabNavigation()}
        {activeTab === "assumptions" && renderAssumptionsTab()}
        {activeTab === "scenarios" && renderScenariosTab()}
        {activeTab === "impact" && renderImpactTab()}
        {renderFooter()}
      </ScrollView>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
        navigation={navigation}
        currentScreen="ScenarioPanel"
      />
    </GradientView>
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
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    paddingVertical: 12,
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
    color: "#ffffff",
    fontWeight: "600",
    marginRight: 4,
  },
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: width - 40,
  },
  tabContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  tabNavigation: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#ffffff",
  },
  tabText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#ff9a9e",
  },
  tabContent: {
    paddingHorizontal: 20,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  driverRow: {
    justifyContent: "space-between",
  },
  driverCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    width: (width - 60) / 2,
  },
  driverHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  driverIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  driverTrend: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  trendIcon: {
    fontSize: 16,
    fontWeight: "bold",
  },
  driverName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  driverValue: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  driverDescription: {
    color: "#9ca3af",
    fontSize: 10,
    lineHeight: 14,
  },
  scenarioCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  scenarioGradient: {
    padding: 20,
  },
  scenarioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  scenarioIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  scenarioMetrics: {
    alignItems: "flex-end",
  },
  scenarioImpact: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  scenarioProbability: {
    color: "#9ca3af",
    fontSize: 12,
  },
  scenarioName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  scenarioDescription: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 8,
  },
  scenarioDetails: {
    color: "#9ca3af",
    fontSize: 12,
    lineHeight: 16,
  },
  assumptionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  assumptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  assumptionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "500",
  },
  assumptionDescription: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 18,
  },
  comparisonGrid: {
    gap: 12,
  },
  comparisonCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  comparisonHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
  },
  comparisonName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  comparisonMetrics: {
    padding: 12,
    gap: 4,
  },
  comparisonImpact: {
    color: "#ffffff",
    fontSize: 12,
  },
  comparisonProbability: {
    color: "#9ca3af",
    fontSize: 10,
  },
  impactCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  impactScenario: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  impactMetrics: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  impactMetricItem: {
    alignItems: "center",
  },
  impactLabel: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 4,
  },
  impactValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  riskGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  riskCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  riskTitle: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  riskValue: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  riskDescription: {
    color: "#9ca3af",
    fontSize: 10,
    textAlign: "center",
    lineHeight: 14,
  },
  footer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 40,
    marginTop: 40,
  },
  footerContent: {
    gap: 30,
  },
  footerSection: {
    gap: 16,
  },
  footerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  footerDescription: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 20,
  },
  socialLinks: {
    flexDirection: "row",
    gap: 16,
  },
  socialLink: {
    padding: 8,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  linkColumn: {
    gap: 12,
  },
  linkColumnTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkItem: {
    paddingVertical: 4,
  },
  linkText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    paddingTop: 20,
    marginTop: 30,
    alignItems: "center",
  },
  copyright: {
    color: "#9ca3af",
    fontSize: 12,
  },
})

export default ScenarioPanelScreen