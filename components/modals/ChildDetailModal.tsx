// components/modals/ChildDetailModal.tsx

import CommentBox from "@/components/commentBox";
import ProfilePicture from "@/components/image/ProfilePicture";
import { UIChild } from "@/hooks/useChildData";
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
}

export const ChildDetailModal: React.FC<ChildDetailModalProps> = ({
  isVisible,
  activeChild,
  onClose,
  getAbsenceLabel,
  onOpenGuestLinkModal,
  onToggleCheckIn,
}) => {
  if (!activeChild) return null;

  const absenceLabel = getAbsenceLabel(activeChild);
  const checkInText = activeChild.checkedIn ? "Sjekk ut" : "Sjekk inn";

  const handleToggleCheckIn = () => {
    onToggleCheckIn(activeChild.id);
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlayBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.overlayCard}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.headerRow}>
              <View style={styles.profilePictureContainer}>
                <ProfilePicture
                  showEdit={true}
                  userId={activeChild.id}
                  userType="child"
                  initialImagePath={activeChild.imageUri}
                />
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.childName}>
                  {activeChild.firstName} {activeChild.lastName}
                </Text>

                {absenceLabel ? (
                  <Text style={styles.statusAbsent}>
                    Fravær: {absenceLabel}
                  </Text>
                ) : (
                  <Text
                    style={
                      activeChild.checkedIn
                        ? styles.statusCheckedIn
                        : styles.statusCheckedOut
                    }
                  >
                    Status:{" "}
                    {activeChild.checkedIn ? "Sjekket inn" : "Sjekket ut"}
                  </Text>
                )}
                <Text style={styles.groupText}>
                  Avdeling: {activeChild.department}
                </Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <Pressable
                style={styles.actionButton}
                onPress={handleToggleCheckIn}
                disabled={!!absenceLabel}
              >
                <Text style={styles.actionButtonText}>{checkInText}</Text>
              </Pressable>

              <Pressable
                style={[styles.actionButton, styles.guestButton]}
                onPress={onOpenGuestLinkModal}
              >
                <Text style={styles.actionButtonText}>Gjeste-hent</Text>
              </Pressable>
            </View>

            <View style={styles.divider} />

            {activeChild.id && <CommentBox childId={activeChild.id} />}
          </ScrollView>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Lukk</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  overlayCard: {
    width: "100%",
    maxHeight: "85%",
    backgroundColor: "#FFF7ED",
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
    backgroundColor: "#eee",
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
    color: "#28a745",
    fontWeight: "600",
  },
  statusCheckedOut: {
    fontSize: 14,
    color: "#dc3545",
    fontWeight: "600",
  },
  statusAbsent: {
    fontSize: 14,
    color: "#E65100",
    fontWeight: "600",
  },
  groupText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#57507F",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 4,
  },
  guestButton: {
    backgroundColor: "#57507F",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: "#57507F",
    borderRadius: 30,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
