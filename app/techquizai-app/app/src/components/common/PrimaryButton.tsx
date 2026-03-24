import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "../../theme/useTheme";

export default function PrimaryButton({ title, onPress }: any) {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
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
    );
}