/**
 * LANGUAGE SWITCHER COMPONENT
 * * ROLE: 
 * A global utility that manages the user's preferred locale.
 * * KEY LOGIC:
 * 1. Persistent State: Updates the i18n context which usually triggers 
 * an async storage save to remember the user's choice on next launch.
 * 2. Visual Feedback: Highlighting the active language in the list 
 * using 'listItemTextSelected' and theme-based primary colors.
 * 3. Accessibility: Uses flags (emojis) alongside native language names 
 * to make the selection intuitive regardless of current language barriers.
 */

import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { spacing } from "@/theme/tokens";
import { useState } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  View,
  FlatList,
  Pressable,
} from "react-native";

const languages = [
  { label: "🇳🇴 Norsk", value: "nb" },
  { label: "🇬🇧 English", value: "en" },
  { label: "🇸🇪 Svenska", value: "sv" },
  { label: "🇺🇦 Українська", value: "uk" },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useI18n();
  const theme = useAppTheme();

  // Find current label to display on the main button
  const selectedLanguage = languages.find((lang) => lang.value === language);

  const handleSelect = (value: string) => {
    setLanguage(value);
    setModalVisible(false);
  };
  
  return (
    <>
      {/* TRIGGER BUTTON */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{selectedLanguage?.label}</Text>
      </TouchableOpacity>
      
      {/* SELECTION MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.modalBackground }]}>
            <View style={[styles.modalHeader, { 
              borderBottomColor: theme.borderLight,
              backgroundColor: theme.modalHeader 
            }]}>
              <Text style={[styles.modalHeaderText, { color: theme.text }]}>
                {t("languageModalHeader")}
              </Text>
            </View>

            <FlatList
              data={languages}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.listItem,
                    { borderBottomColor: theme.borderLight },
                    item.value === language && [
                      styles.listItemSelected,
                      { backgroundColor: theme.listItemBackground }
                    ],
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.listItemText,
                      { color: theme.text },
                      item.value === language && [
                        styles.listItemTextSelected,
                        { color: theme.primary }
                      ],
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: 30,
    width: 155,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    // Added shadow for better visibility on varied backgrounds
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui',
    }),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 16, // Smoother corners
    width: "80%",
    maxHeight: "50%",
    overflow: "hidden",
    elevation: 10,
  },
  modalHeader: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  modalHeaderText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  listItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  listItemSelected: {
    // Styling applied via inline array in component
  },
  listItemText: {
    fontSize: 16,
  },
  listItemTextSelected: {
    fontWeight: "700",
  },
});