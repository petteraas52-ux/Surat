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
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, authError } = useAuthSession();
  const { t } = useI18n();
  const theme = useAppTheme();

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

        {authError && (
          <Text style={[styles.errorText, { color: theme.error ?? "#dc2626" }]}>
            {authError}
          </Text>
        )}

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
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  errorText: {
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,

    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    letterSpacing: 0,
  },
  button: {
    marginTop: 12,

    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
