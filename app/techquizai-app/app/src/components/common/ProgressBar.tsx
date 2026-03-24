import { View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming
} from "react-native-reanimated";

export default function ProgressBar({ progress }: any) {
    const { colors } = useTheme();

    const width = useSharedValue(0);

    width.value = withTiming(progress * 100, { duration: 400 });

    const style = useAnimatedStyle(() => ({
        width: `${width.value}%`
    }));

    return (
        <View
            style={{
                height: 8,
                backgroundColor: colors.border,
                borderRadius: 10,
                overflow: "hidden",
                marginBottom: 20
            }}
        >
            <Animated.View
                style={[
                    {
                        height: "100%",
                        backgroundColor: colors.primary
                    },
                    style
                ]}
            />
        </View>
    );
}