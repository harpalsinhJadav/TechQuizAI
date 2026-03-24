import { useEffect, useState } from "react";
import { View, Text } from "react-native";
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

  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    const res = await quizService.getQuiz(quizId);
    setQuestions(res.data.data);
    setLoading(false);
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

  const q = questions[current];

  return (
    <View style={{ padding: 20 }}>
      <ProgressBar progress={(current + 1) / questions.length} />

      <Text style={{ marginBottom: 10 }}>
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