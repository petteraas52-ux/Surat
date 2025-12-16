// modules/CreateParentModule.tsx

import { createParent } from "@/api/parents";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./commonStyles";

export function CreateParentModal() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useAppTheme();
  const { t } = useI18n();

  const handleCreateParent = async () => {
    if (!firstName || !lastName || !email || !phone || !password) {
      Alert.alert(
        t("missingFieldsTitle") || "Missing fields",
        t("missingFieldsMessage") || "Please fill in all fields."
      );
      return;
    }

    try {
      setLoading(true);

      await createParent(email, password, {
        firstName,
        lastName,
        eMail: email,
        phone,
        imageUri: "",
        children: [],
      });

      Alert.alert(
        t("successTitle") || "Success",
        t("parentCreatedMessage") || "Parent account created successfully."
      );

      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        t("errorTitle") || "Error",
        error.message || t("parentCreationFailed") || "Failed to create parent."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("createParentTitle") || "Create Parent Account"}
      </Text>

      <Text style={styles.label}>{t("firstName") || "First Name"}:</Text>
      <TextInput
        placeholder={t("firstName")}
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <Text style={styles.label}>{t("lastName") || "Last Name"}:</Text>
      <TextInput
        placeholder={t("lastName")}
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <Text style={styles.label}>{t("email") || "Email"}:</Text>
      <TextInput
        placeholder={t("email")}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <Text style={styles.label}>{t("phone") || "Phone"}:</Text>
      <TextInput
        placeholder={t("phone")}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Text style={styles.label}>
        {t("tempPassword") || "Temporary Password"}:
      </Text>
      <TextInput
        placeholder={t("tempPassword")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable
        onPress={handleCreateParent}
        disabled={loading}
        style={[
          styles.createButton,
          { backgroundColor: loading ? theme.primary + "50" : theme.primary },
        ]}
      >
        <Text style={styles.createButtonText}>
          {loading
            ? t("creating") || "Creating..."
            : t("createParent") || "Create Parent"}
        </Text>
      </Pressable>
    </View>
  );
}
