export const lightColors = {
  primary: "#3B82F6", // blue-500
  secondary: "#6366F1", // indigo-500
  background: "#FFFFFF",
  surface: "#F1F5F9",
  surfaceLight: "#F8FAFC",
  text: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  borderLight: "#CBD5E1",
  error: "#EF4444",
  success: "#22C55E",
  warning: "#F59E0B",
  white: "#FFFFFF",
  black: "#000000",
  accent: "#8B5CF6", // purple-500
  glass: "rgba(255, 255, 255, 0.7)",
};

export const darkColors = {
  primary: "#3B82F6", // blue-500
  secondary: "#4F46E5", // indigo-600
  background: "#0A0F1E", // Main background from Figma
  surface: "#111827", // Secondary background/Card
  surfaceLight: "#1E293B", // Lighter surface for interaction
  text: "#F8FAFC", // Almost white
  textSecondary: "#94A3B8", // Slate-400
  border: "#1E293B", // Slate-800
  borderLight: "#334155", // Slate-700
  error: "#F87171",
  success: "#4ADE80",
  warning: "#FBBF24",
  white: "#FFFFFF",
  black: "#000000",
  accent: "#A78BFA", // purple-400
  glass: "rgba(255, 255, 255, 0.03)",
};

export type ThemeColors = typeof lightColors;