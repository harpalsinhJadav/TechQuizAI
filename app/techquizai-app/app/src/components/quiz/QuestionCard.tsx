import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from "react-native-reanimated";

export default function QuestionCard({
    question,
    selected,
    onSelect
}: any) {
    const { colors } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <View>
            <Text style={{ fontSize: 18, marginBottom: 16 }}>
                {question.question}
            </Text>

            {question.options.map((opt: string, i: number) => {
                const isSelected = selected === i;

                return (
                    <Animated.View style={animatedStyle}>
                        <TouchableOpacity
                            onPress={() => {
                                scale.value = withSpring(0.95, {}, () => {
                                    scale.value = withSpring(1);
                                });
                                onSelect(i);
                            }}
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
                    </Animated.View>
                );
            })}
        </View>
    );
}