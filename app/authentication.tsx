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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.inner}>
          <View style={styles.card}>
            <Text style={styles.title}>Logg inn</Text>
            <Text style={styles.subtitle}>
              Logg inn for å sjekke inn/ut dine barn
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Epost</Text>
              <TextInput
                style={styles.input}
                value={userEmail}
                onChangeText={setUserEmail}
                placeholder="din@epost.no"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Passord</Text>
              <TextInput
                style={styles.input}
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                placeholder="Passord"
              />
            </View>

            <Pressable
              style={styles.button}
              onPress={() => {
                signIn(userEmail, password);
              }}
            >
              <Text style={styles.buttonText}>Logg inn</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
