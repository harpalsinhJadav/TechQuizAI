import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ForgotPasswordScreen() {
  const { colors, spacing, scaling } = useTheme();
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { padding: spacing.l }]}>
        <Text style={[styles.title, { color: colors.text, marginBottom: spacing.m }]}>Forgot Password</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Enter your email to receive a password reset link</Text>
        
        <TextInput 
          placeholder="Email" 
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} 
        />

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary, borderRadius: scaling.moderate(8), marginTop: spacing.m }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>Send Link</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ marginTop: spacing.l }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: colors.primary }}>Back to Login</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
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
