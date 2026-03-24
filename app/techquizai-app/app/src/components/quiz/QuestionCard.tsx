import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../theme/useTheme";

export default function QuestionCard({
    question,
    selected,
    onSelect
}: any) {
    const { colors } = useTheme();

    return (
        <View>
            <Text style={{ fontSize: 18, marginBottom: 16 }}>
                {question.question}
            </Text>

            {question.options.map((opt: string, i: number) => {
                const isSelected = selected === i;

                return (
                    <TouchableOpacity
                        key={i}
                        onPress={() => onSelect(i)}
                        style={{
                            padding: 14,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: isSelected
                                ? colors.primary
                                : colors.border,
                            backgroundColor: isSelected
                                ? colors.primary + "20"
                                : "#fff",
                            marginBottom: 10
                        }}
                    >
                        <Text>{opt}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}