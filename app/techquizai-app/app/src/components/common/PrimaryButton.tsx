import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "../../theme/useTheme";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from "react-native-reanimated";

export default function PrimaryButton({ title, onPress }: any) {
    const { colors } = useTheme();
    const scale = useSharedValue(1);

    const style = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <Animated.View style={style}>
            <TouchableOpacity
                onPress={() => {
                    scale.value = withSpring(0.95, {}, () => {
                        scale.value = withSpring(1);
                    });
                    onPress();
                }}
                style={{
                    backgroundColor: colors.primary,
                    padding: 14,
                    borderRadius: 12,
                    alignItems: "center",
                    marginTop: 10
                }}
            >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                    {title}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
}