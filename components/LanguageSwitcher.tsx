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
  const selectedLanguage = languages.find((lang) => lang.value === language);
  const { t } = useI18n();
  const theme = useAppTheme();
  const handleSelect = (value: string) => {
    setLanguage(value);
    setModalVisible(false);
  };
  
  return (
    <>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
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
          style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.modalBackground }]}>
            <View style={[styles.modalHeader, { 
              borderBottomColor: theme.borderLight,
              backgroundColor: theme.modalHeader 
            }]}>
              <Text style={[styles.modalHeaderText, { color: theme.text }]}>{t("languageModalHeader")}</Text>
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
    borderRadius: 12,
    width: "80%",
    maxHeight: "50%",
    overflow: "hidden",
  },
  modalHeader: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  modalHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui',
    }),
  },
  listItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  listItemSelected: {
    // backgroundColor settes dynamisk
  },
  listItemText: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui',
    }),
  },
  listItemTextSelected: {
    fontWeight: "600",
    // color settes dynamisk
  },
});