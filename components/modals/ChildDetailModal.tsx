import { updateChildAllergies } from "@/api/childrenApi";
import { createComment } from "@/api/commentApi";
import CommentBox from "@/components/commentBox";
import ProfilePicture from "@/components/image/ProfilePicture";
import { useAppTheme } from "@/hooks/useAppTheme";
import { UIChild } from "@/hooks/useChildData";
import { useI18n } from "@/hooks/useI18n";
import { useAuthSession } from "@/providers/authctx";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface ChildDetailModalProps {
  isVisible: boolean;
  activeChild: UIChild | undefined;
  onClose: () => void;
  getAbsenceLabel: (child: UIChild) => string | null;
  onOpenGuestLinkModal: () => void;
  onToggleCheckIn: (childId: string | null) => Promise<void>;
  hideGuestButton?: boolean;
}

const AllergyManager: React.FC<{
  allergies: string[];
  onUpdate: (newAllergies: string[]) => void;
  isSaving: boolean;
}> = ({ allergies, onUpdate, isSaving }) => {
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

  return (
    <View style={styles.allergySection}>
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>
          {t("allergies")}
        </Text>
        {isSaving && (
          <ActivityIndicator
            size="small"
            color={theme.primary}
            style={{ marginLeft: 8 }}
          />
        )}
      </View>
      <View style={styles.tokenContainer}>
        {allergies.map((allergy, index) => (
          <View
            key={index}
            style={[styles.token, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.tokenText}>{allergy}</Text>
            <Pressable
              onPress={() => {
                const next = [...allergies];
                next.splice(index, 1);
                onUpdate(next);
              }}
            >
              <Ionicons
                name="close-circle"
                size={16}
                color="#fff"
                style={{ marginLeft: 6 }}
              />
            </Pressable>
          </View>
        ))}
      </View>
      <View
        style={[
          styles.allergyInputRow,
          { borderColor: theme.border, backgroundColor: theme.inputBackground },
        ]}
      >
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={t("addAllergy")}
          placeholderTextColor={theme.textMuted}
          style={[styles.allergyInput, { color: theme.text }]}
          onSubmitEditing={addAllergy}
          editable={!isSaving}
        />
        <Pressable
          onPress={addAllergy}
          style={styles.addAllergyButton}
          disabled={isSaving || !inputValue.trim()}
        >
          <Ionicons
            name="add-circle"
            size={24}
            color={isSaving ? theme.textMuted : theme.primary}
          />
        </Pressable>
      </View>
    </View>
  );
};

export const ChildDetailModal: React.FC<ChildDetailModalProps> = ({
  isVisible,
  activeChild,
  onClose,
  getAbsenceLabel,
  onOpenGuestLinkModal,
  onToggleCheckIn,
  hideGuestButton = false,
}) => {
  const { t } = useI18n();
  const theme = useAppTheme();
  const { user } = useAuthSession();

  const [localAllergies, setLocalAllergies] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentRefreshTrigger, setCommentRefreshTrigger] = useState(0);

  useEffect(() => {
    if (activeChild && isVisible) {
      setLocalAllergies(activeChild.allergies || []);
      setCommentText("");
    }
  }, [activeChild, isVisible]);

  if (!activeChild) return null;

  const handleUpdateAllergies = async (newAllergies: string[]) => {
    setLocalAllergies(newAllergies);
    setIsSaving(true);
    try {
      await updateChildAllergies(activeChild.id, newAllergies);
    } catch (error) {
      setLocalAllergies(activeChild.allergies || []);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateComment = async () => {
    if (!commentText.trim() || !user) return;
    setCommentLoading(true);
    try {
      await createComment({
        childId: activeChild.id,
        text: commentText.trim(),
        createdById: user.uid,
        createdByName: user.displayName ?? user.email ?? t("unknownUser"),
      });
      setCommentText("");
      setCommentRefreshTrigger((prev) => prev + 1);
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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
            <View style={styles.fixedHeader}>
              <View style={styles.headerRow}>
                <View
                  style={[
                    styles.profilePictureContainer,
                    { backgroundColor: theme.inputBackground },
                  ]}
                >
                  <ProfilePicture
                    showEdit
                    userId={activeChild.id}
                    userType="child"
                    initialImagePath={activeChild.imageUri}
                  />
                </View>
                <View style={styles.infoBlock}>
                  <Text style={[styles.childName, { color: theme.text }]}>
                    {activeChild.firstName} {activeChild.lastName}
                  </Text>
                  <Text
                    style={{
                      color: activeChild.checkedIn
                        ? theme.success
                        : theme.error,
                      fontWeight: "600",
                    }}
                  >
                    {t("status")}:{" "}
                    {activeChild.checkedIn ? t("checkedIn") : t("checkedOut")}
                  </Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <Pressable
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.primary },
                  ]}
                  onPress={() => onToggleCheckIn(activeChild.id)}
                >
                  <Text style={styles.actionButtonText}>
                    {activeChild.checkedIn ? t("checkOut") : t("checkIn")}
                  </Text>
                </Pressable>
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
              <AllergyManager
                allergies={localAllergies}
                onUpdate={handleUpdateAllergies}
                isSaving={isSaving}
              />
              <View
                style={[styles.divider, { backgroundColor: theme.borderLight }]}
              />
            </View>

            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <CommentBox
                childId={activeChild.id}
                refreshTrigger={commentRefreshTrigger}
              />
            </ScrollView>

            <View
              style={[
                styles.stickyFooter,
                { borderTopColor: theme.borderLight },
              ]}
            >
              <View style={styles.commentInputRow}>
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder={t("writeAComment")}
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.commentInput,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.inputBackground,
                      color: theme.text,
                    },
                  ]}
                  multiline
                />
                <Pressable
                  onPress={handleCreateComment}
                  disabled={commentLoading || !commentText.trim()}
                  style={[
                    styles.sendButton,
                    { backgroundColor: theme.primary },
                    (commentLoading || !commentText.trim()) && { opacity: 0.5 },
                  ]}
                >
                  {commentLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.sendButtonText}>{t("send")}</Text>
                  )}
                </Pressable>
              </View>
              <Pressable
                style={[styles.closeButton, { backgroundColor: theme.primary }]}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>{t("close")}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  overlayCard: {
    width: "100%",
    height: "85%",
    borderRadius: 24,
    padding: 20,
    display: "flex",
  },
  fixedHeader: { flexShrink: 0 },
  scrollArea: { flex: 1, marginVertical: 8 },
  scrollContent: { paddingBottom: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  profilePictureContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 15,
    overflow: "hidden",
  },
  infoBlock: { flex: 1 },
  childName: { fontSize: 20, fontWeight: "700" },
  actionRow: { flexDirection: "row", gap: 10, marginBottom: 5 },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  actionButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  divider: { height: 1, marginVertical: 12 },
  allergySection: { marginVertical: 4 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionHeader: { fontSize: 16, fontWeight: "700" },
  tokenContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  token: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  tokenText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  allergyInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingRight: 8,
  },
  allergyInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    letterSpacing: 0,
  },
  addAllergyButton: { padding: 4 },
  stickyFooter: { flexShrink: 0, paddingTop: 15, borderTopWidth: 1 },
  commentInputRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-end",
    marginBottom: 12,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 45,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 18,
    height: 45,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "700",
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
