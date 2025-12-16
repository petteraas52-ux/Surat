import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { useAuthSession } from "@/providers/authctx";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function RoleErrorScreen() {
  const { signOut } = useAuthSession();
  const theme = useAppTheme();
  const { t } = useI18n();
  const router = useRouter();

  const errorMessage = t("roleErrorTitle");
  const helpText = t("roleErrorDescription");
  const contactText = t("roleErrorContact");

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.icon, { color: theme.primary }]}>⚠️</Text>
        <Text style={[styles.title, { color: theme.text }]}>
          {errorMessage || "Account Access Issue"}
        </Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {helpText ||
            "We couldn't determine your account type (Parent or Employee)."}
          {"\n\n"}
          {contactText ||
            "Please contact support for assistance or try logging in again."}
        </Text>

        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={signOut}
        >
          <Text style={styles.buttonText}>
            {t("logOutButton") || "Log Out"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.link, { borderColor: theme.border }]}
          onPress={() => {
            console.log("Opening support link...");
          }}
        >
          <Text style={[styles.linkText, { color: theme.textSecondary }]}>
            {t("contactSupport") || "Contact Support"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    padding: 24,
    borderRadius: 12,
  },
  icon: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
