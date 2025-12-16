import { useI18n } from "@/hooks/useI18n";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function NotFoundScreen() {
   const { t } = useI18n();
   const theme = useAppTheme();
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>{t("notFoundPage")}</Text>

        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: theme.primary }]}>{t("notFoundPageBack")}</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
  },
});
