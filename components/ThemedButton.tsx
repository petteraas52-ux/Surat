import {
    StyleSheet,
    Text as RNText,
    TouchableOpacity,
    type TouchableOpacityProps,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { radius, spacing, text } from "@theme/tokens";

export type ThemedButtonProps = TouchableOpacityProps & {
    title: string;
    variant?: "primary" | "secondary";
};

export function ThemedButton({
    title,
    variant = "primary",
    style,
    ...rest
}: ThemedButtonProps) {
    const primaryBg = useThemeColor({}, "tint");
    const secondaryBg = useThemeColor({}, "background");
    const borderColor = useThemeColor({}, "border");
    const textColor = useThemeColor({}, variant === "primary" ? "buttonText" : "text");

    const backgroundColor = variant === "primary" ? primaryBg : secondaryBg;

    return (
        <TouchableOpacity
        style={[
            styles.base,
            { backgroundColor, borderColor },
            variant === "secondary" && styles.secondary,
            style,
        ]}
        {...rest}
        >
            <RNText style={[styles.label, { color: textColor }]}>{title}</RNText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    secondary: {

    },
    label: {
        ...text.bodySemiBold,
    },
});
