import { createDepartment } from "@/api/department";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./commonStyles";

export function ManageDepartmentsModal() {
  const [newName, setNewName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { t } = useI18n();
  const theme = useAppTheme();

  const handleAddDepartment = async () => {
    if (!newName.trim()) return;
    try {
      setSubmitting(true);
      await createDepartment(newName.trim());
      setNewName("");
      Alert.alert(t("successTitle"), t("departmentCreated"));
    } catch (err) {
      Alert.alert(t("errorTitle"), t("failedToCreateDepartment"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("addDepartment")}</Text>
      <Text style={styles.label}>{t("departmentName")}</Text>
      <TextInput
        placeholder={t("departmentNamePlaceholder")}
        value={newName}
        onChangeText={setNewName}
        style={[
          styles.input,
          { backgroundColor: theme.inputBackground, color: theme.text },
        ]}
      />
      <TouchableOpacity
        onPress={handleAddDepartment}
        disabled={submitting}
        style={[
          styles.createButton,
          {
            backgroundColor: submitting ? theme.primary + "50" : theme.primary,
          },
        ]}
      >
        <Text style={styles.createButtonText}>
          {submitting ? t("creating") : t("addDepartment")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
