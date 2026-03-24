import { View } from "react-native";
import { useTheme } from "../../theme/useTheme";

export default function ProgressBar({ progress }: any) {
    const { colors } = useTheme();

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
            <View
                style={{
                    width: `${progress * 100}%`,
                    height: "100%",
                    backgroundColor: colors.primary
                }}
            />
        </View>
    );
}