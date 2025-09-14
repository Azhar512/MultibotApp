"use client"

import { View, Text, StyleSheet, PanGestureHandler, Animated } from "react-native"
import { useState, useRef } from "react"
import { THEME } from "../styles/globalStyles"

const Slider = ({ value, onValueChange, min = 0, max = 100, step = 1, label, style }) => {
  const [sliderWidth, setSliderWidth] = useState(0)
  const pan = useRef(new Animated.Value(0)).current
  const [isDragging, setIsDragging] = useState(false)

  const handleGestureEvent = Animated.event([{ nativeEvent: { translationX: pan } }], {
    useNativeDriver: false,
  })

  const handleGestureStateChange = (event) => {
    if (event.nativeEvent.state === 5) {
      // Gesture ended
      setIsDragging(false)
      const { translationX } = event.nativeEvent
      const percentage = Math.max(0, Math.min(100, (translationX / sliderWidth) * 100 + value))
      const newValue = Math.round(percentage / step) * step
      onValueChange(Math.max(min, Math.min(max, newValue)))
      pan.setValue(0)
    } else if (event.nativeEvent.state === 2) {
      // Gesture began
      setIsDragging(true)
    }
  }

  const thumbPosition = (value / max) * sliderWidth

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}%</Text>
        </View>
      )}
      <View style={styles.sliderContainer} onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width - 20)}>
        <View style={styles.track} />
        <View style={[styles.fill, { width: `${value}%` }]} />
        <PanGestureHandler onGestureEvent={handleGestureEvent} onHandlerStateChange={handleGestureStateChange}>
          <Animated.View
            style={[
              styles.thumb,
              {
                left: thumbPosition,
                transform: [{ scale: isDragging ? 1.2 : 1 }],
              },
            ]}
          />
        </PanGestureHandler>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: "500",
  },
  value: {
    color: THEME.textLight,
    fontSize: 12,
    fontWeight: "600",
  },
  sliderContainer: {
    height: 20,
    justifyContent: "center",
    position: "relative",
  },
  track: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
  },
  fill: {
    position: "absolute",
    height: 8,
    backgroundColor: THEME.primary,
    borderRadius: 4,
  },
  thumb: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: THEME.text,
    borderRadius: 10,
    top: -6,
    marginLeft: -10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})

export default Slider
