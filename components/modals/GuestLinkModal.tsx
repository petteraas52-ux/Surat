import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { UIChild } from "../../hooks/useChildData";
import { useI18n } from "@/hooks/useI18n";
import { useAppTheme } from "@/hooks/useAppTheme";

interface GuestLinkModalProps {
  isVisible: boolean;
  onClose: () => void;
  activeChild: UIChild | undefined;
  guestName: string;
  setGuestName: (text: string) => void;
  guestPhone: string;
  setGuestPhone: (text: string) => void;
  onSendGuestLink: (childId: string | null) => Promise<void>;
  guestSending: boolean;
  guestError: string | null;
}

export const GuestLinkModal: React.FC<GuestLinkModalProps> = ({
  isVisible,
  onClose,
  activeChild,
  guestName,
  setGuestName,
  guestPhone,
  setGuestPhone,
  onSendGuestLink,
  guestSending,
  guestError,
}) => {

  const { t } = useI18n();
  const theme = useAppTheme();

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={[styles.overlayBackdrop, { backgroundColor: theme.modalOverlay }]}>
        <View style={[styles.overlayCard, { 
          backgroundColor: theme.modalBackground,
          alignItems: "center" 
        }]}>
          <Pressable style={[styles.backButton, { backgroundColor: theme.primary }]} onPress={onClose}>
            <Text style={styles.backButtonText}>{t("backButtonText")}</Text>
          </Pressable>

          <Text style={[styles.fetchTitle, { color: theme.text }]}>
            {activeChild
              ? `${activeChild.firstName} ${activeChild.lastName}`
              : t("fetchChildrenText")}
          </Text>

          <View style={[styles.fetchAvatar, { backgroundColor: theme.inputBackground }]}>
            <Text style={{ fontSize: 36 }}>👶</Text>
          </View>

          <Text style={[styles.fetchSubtitle, { color: theme.textSecondary }]}>{t("guestLinkHelpText")}</Text>

          <Text style={[styles.inputLabel, { color: theme.text }]}>{t("name")}:</Text>
          <TextInput
            style={[styles.input, { 
              borderColor: theme.border,
              backgroundColor: theme.inputBackground,
              color: theme.text 
            }]}
            value={guestName}
            onChangeText={setGuestName}
            placeholder={t("nameInputFieldPlaceholder")}
            placeholderTextColor={theme.placeholder}
          />

          <Text style={[styles.inputLabel, { color: theme.text }]}>{t("phone")}:</Text>
          <TextInput
            style={[styles.input, { 
              borderColor: theme.border,
              backgroundColor: theme.inputBackground,
              color: theme.text 
            }]}
            value={guestPhone}
            onChangeText={setGuestPhone}
            placeholder={t("phoneInputFieldPlaceholder")}
            placeholderTextColor={theme.placeholder}
            keyboardType="phone-pad"
          />

          <Pressable
            style={[
              styles.purpleButton,
              {
                backgroundColor: theme.primary,
                marginTop: 24,
                flex: undefined,
                alignSelf: "stretch",
                opacity: guestSending ? 0.7 : 1,
              },
            ]}
            onPress={() => onSendGuestLink(activeChild?.id ?? null)}
            disabled={guestSending}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              {guestSending ? t("sending") : t("sendGuestMessage")}
            </Text>
          </Pressable>

          {guestError && (
            <Text style={{ color: theme.error, marginTop: 8 }}>{guestError}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  overlayCard: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    elevation: 6,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  backButtonText: { 
    color: "#fff", 
    fontWeight: "700" 
  },
  purpleButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  fetchTitle: { 
    fontSize: 22, 
    fontWeight: "700", 
    marginVertical: 12 
  },
  fetchSubtitle: { 
    fontSize: 16, 
    marginBottom: 12 
  },
  fetchAvatar: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  inputLabel: { 
    alignSelf: "flex-start", 
    marginBottom: 4, 
    fontWeight: "600" 
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
});