import { useThemeColor } from "@/hooks/useThemeColor";
import { textStyles } from "@/theme/tokens";
import { Text as RNText, StyleSheet, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <RNText
      style={[
        { color },
        type === "default" && styles.default,
        type === "title" && styles.title,
        type === "defaultSemiBold" && styles.defaultSemiBold,
        type === "subtitle" && styles.subtitle,
        type === "link" && styles.link,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    ...textStyles.body,
  },
  defaultSemiBold: {
    ...textStyles.bodySemiBold,
  },
  title: {
    ...textStyles.title,
  },
  subtitle: {
    ...textStyles.subtitle,
  },
  link: {
    ...textStyles.link,
    color: "#0a7ea4",
  },
});
