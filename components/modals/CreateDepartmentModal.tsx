/**
 * MANAGE DEPARTMENTS MODAL
 * * ROLE:
 * A specialized administrative interface for expanding the school's
 * organizational structure.
 * * KEY LOGIC:
 * 1. Sanitized Creation: Trims whitespace from the department name to prevent
 * duplicate-looking entries (e.g., "Preschool " vs "Preschool").
 * 2. Visual Feedback: The primary button dims and changes text to "Creating..."
 * during the API call to prevent accidental double-submissions.
 * 3. Themed Integration: Pulls directly from the shared 'commonStyles' while
 * dynamically applying theme colors for light/dark mode compatibility.
 */

import { createDepartment } from "@/api/departmentApi";
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

  /**
   * CREATE HANDLER
   * Validates input and triggers the department creation in the database.
   */
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
      {/* HEADER SECTION */}
      <Text style={[styles.title, { color: theme.text }]}>
        {t("addDepartment")}
      </Text>

      {/* FORM SECTION */}
      <Text style={[styles.label, { color: theme.text }]}>
        {t("departmentName")}
      </Text>
      <TextInput
        placeholder={t("departmentNamePlaceholder")}
        placeholderTextColor={theme.textMuted}
        value={newName}
        onChangeText={setNewName}
        // Applying local theme overrides to common styles
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
      />

      {/* ACTION BUTTON */}
      <TouchableOpacity
        onPress={handleAddDepartment}
        disabled={submitting}
        style={[
          styles.createButton,
          {
            // Dim the button by 50% opacity when submitting
            backgroundColor: submitting ? theme.primary + "80" : theme.primary,
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
