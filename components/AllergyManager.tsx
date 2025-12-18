import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface AllergyManagerProps {
  allergies: string[];
  onUpdate: (newAllergies: string[]) => void;
}

export const AllergyManager: React.FC<AllergyManagerProps> = ({
  allergies,
  onUpdate,
}) => {
  const theme = useAppTheme();
  const { t } = useI18n();
  const [inputValue, setInputValue] = useState("");

  const addAllergy = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !allergies.includes(trimmed)) {
      onUpdate([...allergies, trimmed]);
      setInputValue("");
    }
  };

  const removeAllergy = (index: number) => {
    const next = [...allergies];
    next.splice(index, 1);
    onUpdate(next);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>
        {t("allergies")}
      </Text>

      <View style={styles.tokenContainer}>
        {allergies.map((allergy, index) => (
          <View
            key={index}
            style={[styles.token, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.tokenText}>{allergy}</Text>
            <Pressable onPress={() => removeAllergy(index)}>
              <Ionicons
                name="close-circle"
                size={18}
                color="#fff"
                style={{ marginLeft: 6 }}
              />
            </Pressable>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.inputRow,
          { borderColor: theme.border, backgroundColor: theme.inputBackground },
        ]}
      >
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={t("addAllergyPlaceholder") || "Add allergy..."}
          placeholderTextColor={theme.textMuted}
          style={[styles.input, { color: theme.text }]}
          onSubmitEditing={addAllergy}
        />
        <Pressable onPress={addAllergy} style={styles.addButton}>
          <Ionicons name="add-circle" size={28} color={theme.primary} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  tokenContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  token: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tokenText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingRight: 8,
  },
  input: { flex: 1, padding: 10, fontSize: 15 },
  addButton: { padding: 4 },
});
