import { StyleSheet, View, type ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { radius, spacing } from "@/theme/tokens";

export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    variant?: "screen" | "card" | "section";
};

export function ThemedView({
    style,
    lightColor,
    darkColor,
    variant = "screen",
    ...rest
}: ThemedViewProps) {
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        variant === "card" ? "cardBackground" : "background"
    );

    return (
        <View
            style={[
                { backgroundColor },
                variant === "screen" && styles.screen,
                variant === "card" && styles.card,
                variant === "section" && styles.section,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: spacing.lg,
    },
    card: {
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    section: {
        marginBottom: spacing.lg,
    },
})