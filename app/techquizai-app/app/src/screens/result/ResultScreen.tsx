import { View, Text } from "react-native";
import { useTheme } from "../../theme/useTheme";

export default function ResultScreen({ route }: any) {
  const { questions, answers } = route.params;
  const { colors } = useTheme();

  let score = 0;

  questions.forEach((q: any, i: number) => {
    if (q.correct_index === answers[i]) score++;
  });

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, color: colors.primary }}>
        Score: {score}/{questions.length}
      </Text>

      {questions.map((q: any, i: number) => {
        const correct = q.correct_index === answers[i];

        return (
          <View key={i} style={{ marginTop: 16 }}>
            <Text>{q.question}</Text>

            <Text style={{ color: correct ? "green" : "red" }}>
              Your: {q.options[answers[i]]}
            </Text>

            {!correct && (
              <Text style={{ color: colors.primary }}>
                Correct: {q.options[q.correct_index]}
              </Text>
            )}

            <Text>{q.explanation}</Text>
          </View>
        );
      })}
    </View>
  );
}