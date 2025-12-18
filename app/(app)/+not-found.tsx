/**
 * NOT FOUND SCREEN (404)
 * * ROLE:
 * This screen is automatically triggered by Expo Router when a user attempts
 * to navigate to a route that does not exist (+not-found.tsx).
 * * KEY FEATURES:
 * 1. Safe Redirection: Provides a clear path back to the application root.
 * 2. Theme Awareness: Respects the user's Dark/Light mode preferences.
 * 3. Localization: Displays the error message in the user's preferred language.
 */

import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  const { t } = useI18n();
  const theme = useAppTheme();

  return (
    <>
      {/* STACK OVERRIDE: 
          Sets the header title for this specific error instance. 
      */}
      <Stack.Screen options={{ title: "Oops!" }} />

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* MAIN ERROR TEXT */}
        <Text style={[styles.title, { color: theme.text }]}>
          {t("notFoundPage")}
        </Text>

        {/* BACK TO SAFETY LINK */}
        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: theme.primary }]}>
            {t("notFoundPageBack")}
          </Text>
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
    textAlign: "center",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
