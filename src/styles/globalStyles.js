import { StyleSheet } from "react-native"

// Theme matching your screenshots exactly
export const THEME = {
  // Auth screen - Blue gradient (from screenshot 1)
  authPrimary: "#6B7FED", // Blue from your auth screen
  authSecondary: "#7B8FFF", // Lighter blue
  
  // Dashboard and main app - Pink/Coral gradient (from screenshots 2-6)
  primary: "#FF8A9B", // Pink/Coral from your dashboard
  secondary: "#FFB4C1", // Lighter pink
  
  // Accent colors
  accent1: "#5B6FED", // Blue for buttons
  accent2: "#FF7B9B", // Pink/coral accent
  accent3: "#10B981", // Green for positive stats
  
  // Background gradients
  authBackground: ["#6B7FED", "#7B8FFF"], // Blue gradient for auth
  background: ["#FF8A9B", "#FFB4C1"], // Pink gradient for main app
  cardBg: "rgba(255, 255, 255, 0.2)", // White cards with transparency

  // Text colors
  text: "#ffffff",
  textLight: "rgba(255, 255, 255, 0.8)",
  textDark: "#2C3E50",

  // Status colors
  success: "#10B981",
  warning: "#FFA726",
  error: "#FF4757",

  // Chart colors
  chartPrimary: "#8B5FBF",
  chartSecondary: "#FF8A9B",
  chartAccent: "#FF9A9A",

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
    xxl: 20,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
}

export const COLORS = [
  THEME.primary,
  THEME.secondary,
  THEME.accent1,
  THEME.accent2,
  THEME.accent3,
  "#42A5F5",
  "#AB47BC",
  "#FFA726",
]

// Global styles matching your first image design
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },

  contentContainer: {
    flex: 1,
    padding: 20,
  },

  card: {
    padding: 20,
    borderRadius: THEME.borderRadius.xxl,
    backgroundColor: THEME.cardBg,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },

  heading: {
    fontSize: THEME.fontSize.xxl,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 16,
  },

  subheading: {
    fontSize: THEME.fontSize.lg,
    fontWeight: "600",
    color: THEME.text,
    marginBottom: 12,
  },

  // Dashboard specific styles
  statsCard: {
    padding: 20,
    borderRadius: THEME.borderRadius.xxl,
    backgroundColor: THEME.cardBg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },

  chartCard: {
    padding: 20,
    borderRadius: THEME.borderRadius.xxl,
    backgroundColor: THEME.cardBg,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },

  // Button styles
  primaryButton: {
    backgroundColor: THEME.accent2,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: THEME.text,
    fontSize: THEME.fontSize.md,
    fontWeight: "bold",
  },

  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },

  secondaryButtonText: {
    color: THEME.text,
    fontSize: THEME.fontSize.sm,
    fontWeight: "600",
  },

  // Input styles
  input: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 15,
    borderRadius: THEME.borderRadius.lg,
    fontSize: THEME.fontSize.md,
    color: THEME.text,
    marginBottom: 15,
  },

  // Navigation styles
  bottomNav: {
    height: 80,
    paddingBottom: 20,
  },

  navItem: {
    padding: 15,
    borderRadius: 15,
  },

  activeNavItem: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
})
