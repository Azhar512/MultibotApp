import { View } from "react-native"

// Enhanced gradient simulation for pink/coral theme
const GradientView = ({ colors = ["#FF8A9B", "#FF9A9A"], style, children, direction = "diagonal", ...props }) => {
  // Create gradient effect using multiple overlapping views
  const createGradientLayers = () => {
    if (colors.length === 1) {
      return { backgroundColor: colors[0] }
    }

    // Base color (pink/coral)
    const baseColor = colors[0]
    return {
      backgroundColor: baseColor,
    }
  }

  // Create multiple overlay layers for better gradient effect
  const overlayLayers =
    colors.length > 1
      ? [
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: "60%",
            backgroundColor: colors[0],
            opacity: 1,
          },
          {
            position: "absolute",
            top: "40%",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors[1] || colors[0],
            opacity: 0.8,
          },
          {
            position: "absolute",
            top: "70%",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors[1] || colors[0],
            opacity: 0.9,
          },
        ]
      : []

  return (
    <View style={[createGradientLayers(), style]} {...props}>
      {overlayLayers.map((layerStyle, index) => (
        <View key={index} style={layerStyle} />
      ))}
      <View style={{ flex: 1, zIndex: 1 }}>{children}</View>
    </View>
  )
}

export default GradientView
export const hasLinearGradient = false
