import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export default function ResetPasswordScreen() {
  const { colors, spacing, scaling } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { padding: spacing.l }]}>
        <Text style={[styles.title, { color: colors.text, marginBottom: spacing.m }]}>Reset Password</Text>
        
        <TextInput 
          placeholder="New Password" 
          secureTextEntry
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} 
        />
        <TextInput 
          placeholder="Confirm New Password" 
          secureTextEntry
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} 
        />

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary, borderRadius: scaling.moderate(8), marginTop: spacing.m }]}
          onPress={() => {}}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
