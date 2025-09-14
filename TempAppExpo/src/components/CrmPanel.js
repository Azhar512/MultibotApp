import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Users, FileText, Clock } from "lucide-react-native"
import { THEME } from "../styles/globalStyles"

const CrmPanel = ({ customerData, callSummary, system, callInProgress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Users size={20} color={THEME.text} />
        <Text style={styles.title}>CRM Integration - {system.toUpperCase()}</Text>
      </View>

      {customerData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{customerData.name || "Unknown Customer"}</Text>
            <Text style={styles.customerDetail}>Phone: {customerData.phone}</Text>
            <Text style={styles.customerDetail}>Email: {customerData.email || "Not available"}</Text>
            <Text style={styles.customerDetail}>
              Last Contact:{" "}
              {customerData.lastContact ? new Date(customerData.lastContact).toLocaleDateString() : "Never"}
            </Text>
            {customerData.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesTitle}>Notes:</Text>
                <Text style={styles.notesText}>{customerData.notes}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {callInProgress && (
        <View style={styles.section}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Call in Progress</Text>
          </View>
          <Text style={styles.liveDescription}>
            Call data will be automatically logged to {system.toUpperCase()} when the call ends.
          </Text>
        </View>
      )}

      {callSummary && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={16} color={THEME.text} />
            <Text style={styles.sectionTitle}>Call Summary</Text>
          </View>
          <ScrollView style={styles.summaryContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.summaryText}>{callSummary.summary}</Text>
            {callSummary.duration && (
              <View style={styles.summaryMeta}>
                <Clock size={12} color={THEME.textLight} />
                <Text style={styles.summaryDuration}>Duration: {callSummary.duration}</Text>
              </View>
            )}
            {callSummary.outcome && <Text style={styles.summaryOutcome}>Outcome: {callSummary.outcome}</Text>}
          </ScrollView>
        </View>
      )}

      {!customerData && !callSummary && !callInProgress && (
        <View style={styles.emptyState}>
          <Users size={48} color={THEME.textLight} />
          <Text style={styles.emptyText}>No CRM data available</Text>
          <Text style={styles.emptySubtext}>Customer information will appear here during calls</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: THEME.text,
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.text,
    marginLeft: 4,
  },
  customerInfo: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 8,
  },
  customerDetail: {
    fontSize: 14,
    color: THEME.textLight,
    marginBottom: 4,
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.text,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    color: THEME.textLight,
    lineHeight: 16,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.success,
    marginRight: 8,
  },
  liveText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.success,
  },
  liveDescription: {
    fontSize: 12,
    color: THEME.textLight,
    fontStyle: "italic",
  },
  summaryContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    maxHeight: 200,
  },
  summaryText: {
    fontSize: 14,
    color: THEME.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  summaryMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryDuration: {
    fontSize: 12,
    color: THEME.textLight,
    marginLeft: 4,
  },
  summaryOutcome: {
    fontSize: 12,
    color: THEME.textLight,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: THEME.textLight,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: THEME.textLight,
    textAlign: "center",
  },
})

export default CrmPanel
