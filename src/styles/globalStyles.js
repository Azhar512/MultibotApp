import { StyleSheet } from "react-native"

// Updated theme to match the exact pink/coral gradient from your first image
export const THEME = {
  // Main gradient colors from your first image - Pink/Coral gradient
  primary: "#FF8A9B", // Pink/Coral from your image
  secondary: "#FF9A9A", // Lighter coral
  accent1: "#8B5FBF", // Purple for icons
  accent2: "#FF4757", // Red/Coral
  accent3: "#10B981", // Green for positive changes

  // Background gradients - Pink/Coral like your first image
  background: ["#FF8A9B", "#FF9A9A"], // Pink to coral gradient
  cardBg: "rgba(255, 255, 255, 0.15)", // Semi-transparent cards

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
