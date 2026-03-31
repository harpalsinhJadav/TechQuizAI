import React from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TextInputProps,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { LucideIcon } from "lucide-react-native";

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  containerStyle?: ViewStyle;
}

export default function CustomInput({
  label,
  error,
  icon: Icon,
  containerStyle,
  ...props
}: CustomInputProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            borderWidth: 1,
          },
        ]}
      >
        {Icon && (
          <Icon
            size={20}
            color={colors.textSecondary}
            style={styles.icon}
          />
        )}
        <TextInput
          placeholderTextColor={colors.textSecondary + "80"}
          style={[styles.input, { color: colors.text }]}
          {...props}
        />
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56, // Premium taller height
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
