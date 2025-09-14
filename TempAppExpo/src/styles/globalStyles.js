import { StyleSheet } from "react-native"

// Create this file: src/styles/globalStyles.js

export const THEME = {
  primary: "#8b5cf6",
  secondary: "#6366f1", 
  accent1: "#06b6d4",
  accent2: "#ec4899",
  accent3: "#10b981",
  background: ["#667eea", "#764ba2"], // Gradient colors
  cardBg: "rgba(255, 255, 255, 0.1)",
  text: "#ffffff",
  textLight: "rgba(255, 255, 255, 0.7)",
  success: "#4ade80",
  warning: "#fbbf24",
  error: "#f87171",
  
  // Additional theme properties
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  }
};

export const COLORS = [THEME.primary, THEME.secondary, THEME.accent1, THEME.accent2]

// Add any other global styles here
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 16,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600",
    color: THEME.text,
    marginBottom: 12,
  },
  // Dashboard specific styles
  statsCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  chartCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 20,
  },
});