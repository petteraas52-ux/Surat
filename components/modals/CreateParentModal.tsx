/**
 * CREATE PARENT MODAL
 * * ROLE:
 * Onboards new parents into the system by creating their credentials and
 * an empty 'children' array in their profile for future linkage.
 * * KEY LOGIC:
 * 1. Admin Auth: Uses 'createAccountViaAdmin' to ensure the current admin
 * isn't signed out when creating a secondary account.
 * 2. Profile Initialization: Sets 'children' to an empty array `[]`. This is
 * critical so that the 'CreateChildModal' has a valid target to push child UIDs into.
 * 3. Input Optimization: Uses 'phone-pad' and 'email-address' keyboards to
 * minimize user entry errors.
 */

import { createAccountViaAdmin } from "@/api/adminApi";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput } from "react-native";
import { styles } from "./commonStyles";

export function CreateParentModal() {
  const { t } = useI18n();
  const theme = useAppTheme();

  // --- STATE ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * SUBMIT HANDLER
   * Triggers account creation and clears form on success.
   */
  const handleCreateParent = async () => {
    if (!firstName || !lastName || !email || !phone || !password) {
      Alert.alert(t("missingFieldsTitle"), t("missingFieldsMessage"));
      return;
    }

    try {
      setLoading(true);

      // We pass "parent" as the role to ensure the Auth record
      // is correctly categorized in your backend logic.
      await createAccountViaAdmin(
        email.trim().toLowerCase(),
        password,
        `${firstName.trim()} ${lastName.trim()}`,
        "parent",
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          eMail: email.trim().toLowerCase(),
          phone: phone.trim(),
          imageUri: "",
          children: [], // Initialized for the 'CreateChild' link logic
        }
      );

      Alert.alert(t("successTitle"), t("parentCreatedMessage"));

      // Clean up form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (error: any) {
      console.error(error);
      Alert.alert(t("errorTitle"), error.message || t("parentCreationFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        {t("createParentTitle")}
      </Text>

      {/* NAME FIELDS */}
      <Text style={[styles.label, { color: theme.text }]}>
        {t("firstName")}:
      </Text>
      <TextInput
        placeholder={t("firstName")}
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor={theme.placeholder}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
      />

      <Text style={[styles.label, { color: theme.text }]}>
        {t("lastName")}:
      </Text>
      <TextInput
        placeholder={t("lastName")}
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor={theme.placeholder}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
      />

      {/* CONTACT INFO */}
      <Text style={[styles.label, { color: theme.text }]}>{t("email")}:</Text>
      <TextInput
        placeholder={t("email")}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={theme.placeholder}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
      />

      <Text style={[styles.label, { color: theme.text }]}>{t("phone")}:</Text>
      <TextInput
        placeholder={t("phone")}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholderTextColor={theme.placeholder}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
      />

      {/* TEMPORARY CREDENTIALS */}
      <Text style={[styles.label, { color: theme.text }]}>
        {t("tempPassword")}:
      </Text>
      <TextInput
        placeholder={t("tempPassword")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={theme.placeholder}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
      />

      <Pressable
        onPress={handleCreateParent}
        disabled={loading}
        style={[
          styles.createButton,
          {
            backgroundColor: loading ? theme.primary + "80" : theme.primary,
            marginBottom: 60, // Extra space for the keyboard
          },
        ]}
      >
        <Text style={styles.createButtonText}>
          {loading ? t("creating") : t("createParent")}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
