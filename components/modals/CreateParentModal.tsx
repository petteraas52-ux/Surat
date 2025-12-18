import { createAccountViaAdmin } from "@/api/adminApi";
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
      Alert.alert(t("missingFieldsTitle"), t("missingFieldsMessage"));
      return;
    }

    try {
      setLoading(true);

      await createAccountViaAdmin(
        email,
        password,
        `${firstName} ${lastName}`,
        "parent",
        {
          firstName,
          lastName,
          eMail: email,
          phone,
          imageUri: "",
          children: [],
        }
      );

      Alert.alert(t("successTitle"), t("parentCreatedMessage"));

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
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>
        {t("createParentTitle")}
      </Text>

      <Text style={[styles.label, { color: theme.text }]}>
        {t("firstName")}:
      </Text>
      <TextInput
        placeholder={t("firstName")}
        value={firstName}
        onChangeText={setFirstName}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
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
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
          },
        ]}
      />

      <Text style={[styles.label, { color: theme.text }]}>{t("email")}:</Text>
      <TextInput
        placeholder={t("email")}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
          },
        ]}
      />

      <Text style={[styles.label, { color: theme.text }]}>{t("phone")}:</Text>
      <TextInput
        placeholder={t("phone")}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
          },
        ]}
      />

      <Text style={[styles.label, { color: theme.text }]}>
        {t("tempPassword")}:
      </Text>
      <TextInput
        placeholder={t("tempPassword")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
          },
        ]}
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
          {loading ? t("creating") : t("createParent")}
        </Text>
      </Pressable>
    </View>
  );
}
