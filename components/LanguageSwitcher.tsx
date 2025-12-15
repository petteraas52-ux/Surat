import { useI18n } from "@/hooks/useI18n";
import { spacing } from "@/theme/tokens";
import { Picker } from "@react-native-picker/picker";
import { Platform, StyleSheet } from "react-native";

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <Picker
      selectedValue={language}
      onValueChange={(value) => setLanguage(value)}
      style={styles.picker}
      dropdownIconColor="#fff"
    >
      <Picker.Item label="🇳🇴 Norsk" value="nb" />
      <Picker.Item label="🇬🇧 English" value="en" />
      <Picker.Item label="🇺🇦 Українська" value="uk" />
    </Picker>
  );
}

const styles = StyleSheet.create({
  picker: {
    borderRadius: 999, // men bør egentlig være radius.xl ellerno
    backgroundColor: "#57507F",

    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,

    color: "#ffffffff",

    marginTop: 30,

    width: 155,
    height: 45,

    fontWeight: "600",
    fontSize: 16,
    fontFamily: "system-ui",
    textAlign: "center",

    ...(Platform.OS === "android" && {
      backgroundColor: "transparent",
      fontFamily: "Roboto",
    }),
    ...(Platform.OS === "ios" && {
      height: 44,
      fontFamily: "System",
    }),
  },
});
