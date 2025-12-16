// components/modals/ChildDetailModal.tsx
import CommentBox from "@/components/commentBox";
import ProfilePicture from "@/components/image/ProfilePicture";
import { useAppTheme } from "@/hooks/useAppTheme";
import { UIChild } from "@/hooks/useChildData";
import { useI18n } from "@/hooks/useI18n";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ChildDetailModalProps {
  isVisible: boolean;
  activeChild: UIChild | undefined;
  onClose: () => void;
  getAbsenceLabel: (child: UIChild) => string | null;
  onOpenGuestLinkModal: () => void;
  onToggleCheckIn: (childId: string | null) => Promise<void>;
  /** NY: Skjul gjeste-hent knappen */
  hideGuestButton?: boolean;
}

export const ChildDetailModal: React.FC<ChildDetailModalProps> = ({
  isVisible,
  activeChild,
  onClose,
  getAbsenceLabel,
  onOpenGuestLinkModal,
  onToggleCheckIn,
  hideGuestButton = false, // default: vis knappen som før
}) => {
  const { t } = useI18n();
  const theme = useAppTheme();
  if (!activeChild) return null;

  const absenceLabel = getAbsenceLabel(activeChild);
  const checkInText = activeChild.checkedIn ? "Sjekk ut" : "Sjekk inn";

  const handleToggleCheckIn = () => {
    onToggleCheckIn(activeChild.id);
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View
        style={[
          styles.overlayBackdrop,
          { backgroundColor: theme.modalOverlay },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View
          style={[styles.overlayCard, { backgroundColor: theme.background }]}
        >
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.headerRow}>
              <View
                style={[
                  styles.profilePictureContainer,
                  { backgroundColor: theme.inputBackground },
                ]}
              >
                <ProfilePicture
                  showEdit={true}
                  userId={activeChild.id}
                  userType="child"
                  initialImagePath={activeChild.imageUri}
                />
              </View>
              <View style={styles.infoBlock}>
                <Text style={[styles.childName, { color: theme.text }]}>
                  {activeChild.firstName} {activeChild.lastName}
                </Text>

                {absenceLabel ? (
                  <Text style={[styles.statusAbsent, { color: theme.warning }]}>
                    {t("absence")}: {absenceLabel}
                  </Text>
                ) : (
                  <Text
                    style={
                      activeChild.checkedIn
                        ? [styles.statusCheckedIn, { color: theme.success }]
                        : [styles.statusCheckedOut, { color: theme.error }]
                    }
                  >
                    {t("status")}:{" "}
                    {activeChild.checkedIn ? t("checkedIn") : t("checkedOut")}
                  </Text>
                )}
                <Text
                  style={[styles.groupText, { color: theme.textSecondary }]}
                >
                  {t("department")}: {activeChild.department}
                </Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <Pressable
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: absenceLabel
                      ? theme.inputBackground
                      : theme.primary,
                  },
                ]}
                onPress={handleToggleCheckIn}
                disabled={!!absenceLabel}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    {
                      color: absenceLabel ? theme.textMuted : "#fff",
                    },
                  ]}
                >
                  {checkInText}
                </Text>
              </Pressable>

              {/* Vis gjeste-hent bare hvis den ikke er skjult */}
              {!hideGuestButton && (
                <Pressable
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.primary },
                  ]}
                  onPress={onOpenGuestLinkModal}
                >
                  <Text style={styles.actionButtonText}>Gjeste-hent</Text>
                </Pressable>
              )}
            </View>

            <View
              style={[styles.divider, { backgroundColor: theme.borderLight }]}
            />

            {activeChild.id && <CommentBox childId={activeChild.id} />}
          </ScrollView>

          <Pressable
            style={[styles.closeButton, { backgroundColor: theme.primary }]}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>{t("close")}</Text>
          </Pressable>
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
    maxHeight: "85%",
    borderRadius: 20,
    padding: 20,
    elevation: 6,
  },
  contentContainer: {
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePictureContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 15,
    overflow: "hidden",
  },
  infoBlock: {
    flex: 1,
  },
  childName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  statusCheckedIn: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusCheckedOut: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusAbsent: {
    fontSize: 14,
    fontWeight: "600",
  },
  groupText: {
    fontSize: 14,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
