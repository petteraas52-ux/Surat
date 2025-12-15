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
  const selectedLanguage = languages.find((lang) => lang.value === language);
  const { t } = useI18n();
  const handleSelect = (value: string) => {
    setLanguage(value);
    setModalVisible(false);
  };
  
  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{selectedLanguage?.label}</Text>
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>{t("languageModalHeader")}</Text>
            </View>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.listItem,
                    item.value === language && styles.listItemSelected,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.listItemText,
                      item.value === language && styles.listItemTextSelected,
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
    backgroundColor: "#57507F",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: 30,
    width: 155,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "80%",
    maxHeight: "50%",
    overflow: "hidden",
  },
  modalHeader: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
  },
  modalHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  listItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  listItemSelected: {
    backgroundColor: "#f0f0f0",
  },
  listItemText: {
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    color: "#000",
  },
  listItemTextSelected: {
    fontWeight: "600",
    color: "#57507F",
  },
});