import { View, Text, StyleSheet, Dimensions } from "react-native"
import { THEME } from "../styles/globalStyles"

const { width } = Dimensions.get("window")

const ChartCard = ({ title, data, type, style }) => {
  const renderChart = () => {
    const chartWidth = width - 60
    const chartHeight = 200

    if (!data || data.length === 0) {
      return (
        <View style={styles.chartPlaceholder}>
          <View style={styles.chartGradientLayer} />
          <View style={styles.chartContent}>
            <Text style={styles.noDataText}>No data available</Text>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartGradientLayer} />
        <View style={styles.chartContent}>
          <Text style={styles.chartTypeText}>{type.toUpperCase()} Chart</Text>
          <Text style={styles.dataPointsText}>{data.length} data points available</Text>
          <Text style={styles.statusText}>✅ Pure React Native UI</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.card}>
        <View style={styles.cardGradientLayer1} />
        <View style={styles.cardGradientLayer2} />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{title}</Text>
          {renderChart()}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
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
  cardGradientLayer1: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  cardGradientLayer2: {
    position: "absolute",
    top: "60%",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  cardContent: {
    padding: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 20,
  },
  chartContainer: {
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  chartPlaceholder: {
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  chartGradientLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  chartContent: {
    zIndex: 1,
    alignItems: "center",
  },
  chartTypeText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dataPointsText: {
    color: THEME.textLight,
    fontSize: 14,
    textAlign: "center",
  },
  noDataText: {
    color: THEME.textLight,
    fontSize: 14,
  },
  statusText: {
    color: THEME.textLight,
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
})

export default ChartCard
