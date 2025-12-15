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

  const { signIn } = useAuthSession();
  const { t } = useI18n();
  const content = (
    <View style={styles.inner}>
      <View style={styles.card}>
        <Text style={styles.title}>{t("logInButtonText")}</Text>
        <Text style={styles.subtitle}>{t("loginHelpText")}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("email")}</Text>
          <TextInput
            style={styles.input}
            value={userEmail}
            onChangeText={setUserEmail}
            placeholder={t("placeholderEmail")}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("password")}</Text>
          <TextInput
            style={styles.input}
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            placeholder={t("placeholderPassword")}
          />
        </View>

        <Pressable
          style={styles.button}
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
      style={styles.container}
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
    backgroundColor: "#fff",
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
    color: "#666",
    marginBottom: 20,
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
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  button: {
    marginTop: 12,
    backgroundColor: "#2563eb",
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
