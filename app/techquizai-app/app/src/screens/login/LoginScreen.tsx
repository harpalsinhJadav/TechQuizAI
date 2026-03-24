import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useUserStore } from '../../store';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

export default function LoginScreen() {
  const { colors, spacing, scaling } = useTheme();
  const setUser = useUserStore(state => state.setUser);
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = () => {
    // Mock login logic
    const mockUser = {
      id: '1',
      name: 'User',
      email: 'user@example.com',
    };
    setUser(mockUser);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text, marginBottom: spacing.m }]}>
          {t('welcome')}
        </Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary, borderRadius: scaling.moderate(8), marginTop: spacing.m }]}
          onPress={handleLogin}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>{t('login')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ marginTop: spacing.l }}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={{ color: colors.textSecondary }}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ marginTop: spacing.m }}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={{ color: colors.primary }}>Don't have an account? Sign Up</Text>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
