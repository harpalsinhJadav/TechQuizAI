import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
}

export default function PrimaryButton({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  loading,
}: PrimaryButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const getVariantStyles = (): {
    button: ViewStyle;
    text: TextStyle;
  } => {
    switch (variant) {
      case "secondary":
        return {
          button: { backgroundColor: colors.surfaceLight },
          text: { color: colors.text },
        };
      case "outline":
        return {
          button: {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: colors.borderLight,
          },
          text: { color: colors.textSecondary },
        };
      case "ghost":
        return {
          button: { backgroundColor: "transparent" },
          text: { color: colors.textSecondary },
        };
      case "primary":
      default:
        return {
          button: { backgroundColor: colors.primary },
          text: { color: "#fff" },
        };
    }
  };

  const variantStyles = getVariantStyles();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={loading}
        style={[styles.button, variantStyles.button]}
      >
        <Text style={[styles.text, variantStyles.text, textStyle]}>
          {loading ? "Loading..." : title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "100%",
  },
  button: {
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});