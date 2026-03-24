import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;
type ResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ResultScreen() {
  const { colors, spacing, scaling } = useTheme();
  const navigation = useNavigation<ResultScreenNavigationProp>();
  const route = useRoute<ResultScreenRouteProp>();
  const { score, total } = route.params;
  const { t } = useTranslation();

  const handleBackHome = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { padding: spacing.l }]}>
        <Text style={[styles.title, { color: colors.text }]}>{t('quiz_result')}</Text>
        <Text style={[styles.score, { color: colors.primary, marginVertical: spacing.l }]}>
          {t('score', { score, total })}
        </Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary, borderRadius: scaling.moderate(8) }]}
          onPress={handleBackHome}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>{t('back_home')}</Text>
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
  score: {
    fontSize: 42,
    fontWeight: 'bold',
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
