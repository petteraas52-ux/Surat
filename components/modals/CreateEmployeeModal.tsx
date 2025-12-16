// modules/CreateEmployeeModule.tsx

import { createEmployee } from "@/api/employees";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./commonStyles";

export function CreateEmployeeModal() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useAppTheme();
  const { t } = useI18n();

  const handleCreateEmployee = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !department ||
      !password
    ) {
      Alert.alert(
        t("missingFieldsTitle") || "Missing fields",
        t("missingFieldsMessage") || "Please fill in all fields."
      );
      return;
    }

    try {
      setLoading(true);

      await createEmployee(email, password, {
        firstName,
        lastName,
        eMail: email,
        phone,
        department,
        imageUri: "",
      });

      Alert.alert(
        t("successTitle") || "Success",
        t("employeeCreatedMessage") || "Employee account created successfully."
      );

      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setDepartment("");
      setPassword("");
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        t("errorTitle") || "Error",
        error.message ||
          t("employeeCreationFailed") ||
          "Failed to create employee."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("createEmployeeTitle") || "Create Employee Account"}
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

      <Text style={styles.label}>{t("department") || "Department"}:</Text>
      <TextInput
        placeholder={t("department")}
        value={department}
        onChangeText={setDepartment}
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
        onPress={handleCreateEmployee}
        disabled={loading}
        style={[
          styles.createButton,
          { backgroundColor: loading ? theme.primary + "50" : theme.primary },
        ]}
      >
        <Text style={styles.createButtonText}>
          {loading
            ? t("creating") || "Creating..."
            : t("createEmployee") || "Create Employee"}
        </Text>
      </Pressable>
    </View>
  );
}
