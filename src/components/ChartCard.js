import { View, Text, StyleSheet, Dimensions } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { LineChart, BarChart, PieChart } from "react-native-chart-kit"
import { THEME, COLORS } from "../styles/globalStyles"

const { width } = Dimensions.get("window")

const ChartCard = ({ title, data, type, style }) => {
  const chartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: "transparent",
    backgroundGradientTo: "transparent",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  }

  const renderChart = () => {
    const chartWidth = width - 60
    const chartHeight = 200

    switch (type) {
      case "line":
        return (
          <LineChart
            data={{
              labels: data.slice(0, 6).map((item) => item._id?.date || ""),
              datasets: [
                {
                  data: data.slice(0, 6).map((item) => item.count || 0),
                  color: (opacity = 1) => THEME.primary,
                  strokeWidth: 3,
                },
              ],
            }}
            width={chartWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        )

      case "bar":
        return (
          <BarChart
            data={{
              labels: data.map((item) => item.name.substring(0, 3)),
              datasets: [
                {
                  data: data.map((item) => item.value),
                },
              ],
            }}
            width={chartWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        )

      case "pie":
        const pieData = data.map((item, index) => ({
          name: item.name,
          population: item.value,
          color: COLORS[index % COLORS.length],
          legendFontColor: THEME.text,
          legendFontSize: 12,
        }))

        return (
          <PieChart
            data={pieData}
            width={chartWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        )

      default:
        return null
    }
  }

  return (
    <View style={[styles.container, style]}>
      <LinearGradient colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]} style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        {renderChart()}
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 20,
  },
  chart: {
    borderRadius: 12,
  },
})

export default ChartCard
