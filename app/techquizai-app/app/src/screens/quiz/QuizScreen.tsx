import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { quizService } from "../../services/quizService";
import QuestionCard from "../../components/quiz/QuestionCard";
import ProgressBar from "../../components/common/ProgressBar";
import PrimaryButton from "../../components/common/PrimaryButton";
import Loader from "../../components/common/Loader";
import Animated, {
  FadeInRight,
  FadeOutLeft
} from "react-native-reanimated";

export default function QuizScreen({ route, navigation }: any) {
  const { quizId } = route.params;
  const { colors } = useTheme();

  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      const res = await quizService.getQuiz(quizId);
      // Safety check for response structure
      setQuestions(res?.data?.data || res?.data || []);
    } catch (error) {
      console.error("Failed to load quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      navigation.navigate("Result", {
        questions,
        answers
      });
    }
  };

  const handleSelect = (index: number) => {
    const updated = [...answers];
    updated[current] = index;
    setAnswers(updated);
  };

  if (loading) return <Loader />;

  if (!questions || questions.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <Text style={{ color: colors.text }}>No questions found. Please try again.</Text>
      </View>
    );
  }

  const q = questions[current];

  return (
    <View style={{ padding: 20, flex: 1, backgroundColor: colors.background }}>
      <ProgressBar progress={(current + 1) / questions.length} />

      <Text style={{ marginBottom: 10, color: colors.textSecondary }}>
        Question {current + 1}/{questions.length}
      </Text>

      <Animated.View
        key={current}
        entering={FadeInRight.duration(300)}
        exiting={FadeOutLeft.duration(200)}
      >
        <QuestionCard
          question={q}
          selected={answers[current]}
          onSelect={handleSelect}
        />
      </Animated.View>

      <PrimaryButton
        title="Next"
        onPress={handleNext}
        disabled={answers[current] === undefined}
      />

    </View>
  );
}