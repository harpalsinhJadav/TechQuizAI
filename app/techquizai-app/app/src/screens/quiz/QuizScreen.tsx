import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;
type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function QuizScreen() {
  const { colors, spacing, scaling } = useTheme();
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const route = useRoute<QuizScreenRouteProp>();
  const { categoryId } = route.params;
  const { t } = useTranslation();
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 5;

  const handleAnswer = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigation.replace('Result', { score: 4, total: totalQuestions });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { padding: spacing.l }]}>
        <Text style={[styles.progress, { color: colors.textSecondary }]}>
          Question {currentQuestion} / {totalQuestions}
        </Text>
        <View style={styles.questionContainer}>
          <Text style={[styles.question, { color: colors.text }]}>
            What is the capital of {categoryId}?
          </Text>
        </View>
        <View style={styles.optionsContainer}>
          {[1, 2, 3, 4].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                { 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border,
                  borderRadius: scaling.moderate(8) 
                }
              ]}
              onPress={handleAnswer}
            >
              <Text style={[styles.optionText, { color: colors.text }]}>Option {option}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  },
  progress: {
    fontSize: 14,
    marginBottom: 20,
  },
  questionContainer: {
    marginVertical: 40,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginTop: 20,
  },
  option: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
  },
});
