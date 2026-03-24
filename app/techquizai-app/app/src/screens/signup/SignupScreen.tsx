import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SignupScreen() {
  const { colors, spacing, scaling } = useTheme();
  const navigation = useNavigation<SignupScreenNavigationProp>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { padding: spacing.l }]}>
        <Text style={[styles.title, { color: colors.text, marginBottom: spacing.m }]}>Create Account</Text>
        
        <TextInput 
          placeholder="Name" 
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} 
        />
        <TextInput 
          placeholder="Email" 
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} 
        />
        <TextInput 
          placeholder="Password" 
          secureTextEntry
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} 
        />

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary, borderRadius: scaling.moderate(8), marginTop: spacing.m }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ marginTop: spacing.l }}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={{ color: colors.primary }}>Already have an account? Login</Text>
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
