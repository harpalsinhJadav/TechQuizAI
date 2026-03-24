import { ActivityIndicator } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

export default function Loader() {
    const { colors } = useTheme();
    return <ActivityIndicator size="large" color={colors.primary} />;
}