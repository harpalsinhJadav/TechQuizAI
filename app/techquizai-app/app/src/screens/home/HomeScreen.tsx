import React, { useState } from 'react';
import { TextInput, Alert, View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image, ScrollView } from 'react-native';
import PrimaryButton from "../../components/common/PrimaryButton";
import CustomInput from "../../components/common/CustomInput";
import ThemeCard from "../../components/common/ThemeCard";
import { quizService } from "../../services/quizService";
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTranslation } from 'react-i18next';
import { Search, Brain, Code, Sparkles } from 'lucide-react-native';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const categories = [
  { id: '1', title: 'Fullstack', image: require('../../assets/images/cat_fullstack.png'), color: '#3B82F6' },
  { id: '2', title: 'AI & ML', image: require('../../assets/images/cat_ai.png'), color: '#8B5CF6' },
  { id: '3', title: 'React Native', icon: Code, color: '#61DAFB' },
  { id: '4', title: 'TypeScript', icon: Sparkles, color: '#3178C6' },
];

export default function HomeScreen() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useTranslation();

  const handleCategoryPress = (category: any) => {
    navigation.navigate('Quiz', { categoryId: category.id });
  };

  const handleStart = async () => {
    try {
      if (!topic.trim()) {
        return Alert.alert("Enter topic");
      }
      setLoading(true);
      const res = await quizService.generateQuiz(topic);
      navigation.navigate("Quiz", { quizId: res.quizId });
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.error || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Hello, Learner 👋</Text>
            <Text style={[styles.title, { color: colors.text }]}>What's next?</Text>
          </View>
          <TouchableOpacity style={[styles.profileBtn, { backgroundColor: colors.surfaceLight }]}>
             <Brain size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ThemeCard variant="glass" style={styles.heroCard}>
          <Text style={[styles.heroTitle, { color: '#fff' }]}>Generate Custom Quiz</Text>
          <Text style={[styles.heroSubtitle, { color: 'rgba(255,255,255,0.7)' }]}>
            Type any topic and our AI will create a personalized quiz for you.
          </Text>
          
          <CustomInput
            placeholder="e.g. Quantum Mechanics, React Hooks..."
            value={topic}
            onChangeText={setTopic}
            icon={Search}
            containerStyle={styles.inputContainer}
          />

          <PrimaryButton
            title={loading ? "Generating..." : "Start Quiz"}
            onPress={handleStart}
            loading={loading}
          />
        </ThemeCard>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Topics</Text>
          <TouchableOpacity>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesGrid}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.categoryWrapper}
              onPress={() => handleCategoryPress(item)}
            >
              <ThemeCard style={styles.categoryCard}>
                {item.image ? (
                  <Image source={item.image} style={styles.categoryIcon} resizeMode="contain" />
                ) : item.icon ? (
                  <item.icon size={32} color={item.color} style={styles.categoryIcon} />
                ) : null}
                <Text style={[styles.categoryTitle, { color: colors.text }]}>{item.title}</Text>
              </ThemeCard>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCard: {
    padding: 24,
    marginBottom: 32,
    backgroundColor: '#1E293B', // Forced dark for hero
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  categoryWrapper: {
    width: '50%',
    padding: 8,
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    marginVertical: 0,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

