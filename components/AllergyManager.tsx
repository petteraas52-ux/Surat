import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface AllergyManagerProps {
  allergies: string[];
  onUpdate: (newAllergies: string[]) => void;
}

/**
 * ALLERGY MANAGER COMPONENT
 * Handles the logic for adding and removing dietary restrictions or allergies.
 * Items are managed as a 'tokenized' list for better mobile UX.
 */
export const AllergyManager: React.FC<AllergyManagerProps> = ({
  allergies,
  onUpdate,
}) => {
  const theme = useAppTheme();
  const { t } = useI18n();
  const [inputValue, setInputValue] = useState("");

  const addAllergy = () => {
    const trimmed = inputValue.trim();
    // Prevent empty entries and duplicates
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

      {/* RENDER ACTIVE TOKENS */}
      <View style={styles.tokenContainer}>
        {allergies.map((allergy, index) => (
          <View
            key={`${allergy}-${index}`}
            style={[styles.token, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.tokenText}>{allergy}</Text>
            <Pressable
              onPress={() => removeAllergy(index)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Easier to tap on mobile
            >
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

      {/* ADD NEW ALLERGY INPUT */}
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
          returnKeyType="done"
        />
        <Pressable
          onPress={addAllergy}
          style={styles.addButton}
          disabled={!inputValue.trim()}
        >
          <Ionicons
            name="add-circle"
            size={28}
            color={inputValue.trim() ? theme.primary : theme.textMuted}
          />
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
    elevation: 2, // Slight shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tokenText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingRight: 8,
  },
  input: { flex: 1, padding: 12, fontSize: 15, letterSpacing: 0 },
  addButton: {
    padding: 4,
  },
});
