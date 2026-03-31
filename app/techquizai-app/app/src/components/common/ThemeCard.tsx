import React from "react";
import { View, StyleSheet, ViewStyle, Platform } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

interface ThemeCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "glass" | "outline";
}

export default function ThemeCard({ children, style, variant = "default" }: ThemeCardProps) {
  const { colors } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "glass":
        return {
          backgroundColor: colors.glass,
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: colors.border,
          borderWidth: 1,
        };
      default:
        return {
          backgroundColor: colors.surface,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            },
            android: {
              elevation: 4,
            },
          }),
        };
    }
  };

  return (
    <View style={[styles.card, getVariantStyles(), style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
});
