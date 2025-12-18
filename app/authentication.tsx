/**
 * AUTHENTICATION SCREEN
 * * ROLE:
 * The entry point for unauthenticated users to access the application.
 * * KEY FEATURES:
 * 1. Keyboard Management: Uses 'KeyboardAvoidingView' and 'TouchableWithoutFeedback'
 * to ensure inputs remain visible and the keyboard dismisses on tap.
 * 2. Theme Integration: Dynamically colors cards, inputs, and text for light/dark modes.
 * 3. Cross-Platform: Handles Web vs. Native event propagation differences.
 */

import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import "@/i18n";
import { useAuthSession } from "@/providers/authctx";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Authentication = () => {
  // --- LOCAL STATE ---
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- HOOKS ---
  const { signIn, authError } = useAuthSession();
  const { t } = useI18n();
  const theme = useAppTheme();

  /**
   * REUSABLE CONTENT BLOCK
   * Defined outside the return to easily wrap with platform-specific
   * touch handlers (TouchableWithoutFeedback for native, raw View for web).
   */
  const content = (
    <View style={styles.inner}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.backgroundSecondary,
            shadowColor: theme.shadow,
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          {t("logInButtonText")}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t("loginHelpText")}
        </Text>

        {/* ERROR MESSAGE DISPLAY */}
        {authError && (
          <Text style={[styles.errorText, { color: theme.error ?? "#dc2626" }]}>
            {authError}
          </Text>
        )}

        {/* EMAIL INPUT */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            {t("email")}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.border,
                backgroundColor: theme.inputBackground,
                color: theme.text,
              },
            ]}
            value={userEmail}
            onChangeText={setUserEmail}
            placeholder={t("placeholderEmail")}
            placeholderTextColor={theme.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* PASSWORD INPUT */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            {t("password")}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.border,
                backgroundColor: theme.inputBackground,
                color: theme.text,
              },
            ]}
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            placeholder={t("placeholderPassword")}
            placeholderTextColor={theme.placeholder}
          />
        </View>

        {/* SUBMIT BUTTON */}
        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => {
            signIn(userEmail, password);
          }}
        >
          <Text style={styles.buttonText}>{t("logInButtonText")}</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      {/* On Mobile: Tap outside the input to dismiss the keyboard.
          On Web: This is unnecessary and can cause focus issues.
      */}
      {Platform.OS === "web" ? (
        content
      ) : (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          {content}
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
};

export default Authentication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 24,
    lineHeight: 20,
  },
  errorText: {
    marginBottom: 16,
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
