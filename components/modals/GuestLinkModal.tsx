/**
 * GUEST LINK MODAL
 * * ROLE:
 * Facilitates the "Guest Pickup" workflow. It collects contact details for
 * a third party and triggers an SMS or link-sharing event.
 * * KEY LOGIC:
 * 1. Dependency Injection: Uses props for input state (guestName, guestPhone)
 * allowing the parent screen to manage the data lifecycle.
 * 2. Visual Hierarchy: Displays the child's identity prominently to ensure
 * the link is being generated for the correct minor.
 * 3. Validation Feedback: Displays 'guestError' and 'guestSending' states
 * directly within the modal to keep the user informed during network calls.
 */

import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
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
      <View
        style={[
          styles.overlayBackdrop,
          { backgroundColor: theme.modalOverlay },
        ]}
      >
        <View
          style={[
            styles.overlayCard,
            {
              backgroundColor: theme.modalBackground,
              alignItems: "center",
            },
          ]}
        >
          {/* NAVIGATION */}
          <Pressable
            style={[styles.backButton, { backgroundColor: theme.primary }]}
            onPress={onClose}
          >
            <Text style={styles.backButtonText}>{t("backButtonText")}</Text>
          </Pressable>

          {/* CHILD IDENTITY */}
          <Text style={[styles.fetchTitle, { color: theme.text }]}>
            {activeChild
              ? `${activeChild.firstName} ${activeChild.lastName}`
              : t("fetchChildrenText")}
          </Text>

          <View
            style={[
              styles.fetchAvatar,
              { backgroundColor: theme.inputBackground },
            ]}
          >
            <Text style={{ fontSize: 36 }}>👶</Text>
          </View>

          <Text style={[styles.fetchSubtitle, { color: theme.textSecondary }]}>
            {t("guestLinkHelpText")}
          </Text>

          {/* FORM INPUTS */}
          <Text style={[styles.inputLabel, { color: theme.text }]}>
            {t("name")}:
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.border,
                backgroundColor: theme.inputBackground,
                color: theme.text,
              },
            ]}
            value={guestName}
            onChangeText={setGuestName}
            placeholder={t("nameInputFieldPlaceholder")}
            placeholderTextColor={theme.placeholder}
          />

          <Text style={[styles.inputLabel, { color: theme.text }]}>
            {t("phone")}:
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.border,
                backgroundColor: theme.inputBackground,
                color: theme.text,
              },
            ]}
            value={guestPhone}
            onChangeText={setGuestPhone}
            placeholder={t("phoneInputFieldPlaceholder")}
            placeholderTextColor={theme.placeholder}
            keyboardType="phone-pad"
          />

          {/* ACTION BUTTON */}
          <Pressable
            style={[
              styles.purpleButton,
              {
                backgroundColor: theme.primary,
                marginTop: 24,
                alignSelf: "stretch",
                opacity: guestSending ? 0.7 : 1,
              },
            ]}
            onPress={() => onSendGuestLink(activeChild?.id ?? null)}
            disabled={guestSending}
          >
            {guestSending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                {t("sendGuestMessage")}
              </Text>
            )}
          </Pressable>

          {/* ERROR FEEDBACK */}
          {guestError && (
            <Text style={[styles.errorText, { color: theme.error }]}>
              {guestError}
            </Text>
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
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginBottom: 10,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  purpleButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  fetchTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  fetchSubtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  fetchAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  inputLabel: {
    alignSelf: "flex-start",
    marginBottom: 6,
    fontWeight: "700",
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  errorText: {
    marginTop: 12,
    textAlign: "center",
    fontWeight: "600",
  },
});
