/**
 * CHANGE PIN MODAL
 * * ROLE:
 * Allows users (parents/staff) to update their security PIN.
 * Requires validation of the current PIN before permitting a change.
 * * KEY LOGIC:
 * 1. State Validation: Checks for 4-digit formatting and PIN matching.
 * 2. Feedback Loop: Displays specific error messages (e.g., "Old PIN is wrong")
 * and a temporary success state before auto-closing.
 * 3. Security: Uses 'secureTextEntry' and 'number-pad' to ensure a safe
 * and constrained input environment.
 */

import { getUserPin, setUserPin } from "@/api/pinApi";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ChangePinModal({
  uid,
  visible,
  onClose,
}: {
  uid: string;
  visible: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const theme = useAppTheme();

  // --- INTERNAL STATE ---
  const [savedPin, setSavedPin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * INITIAL PIN FETCH
   * Retrieves the current stored PIN from Firestore to validate against.
   */
  useEffect(() => {
    if (!visible) {
      // Clear fields when modal closes
      setError(null);
      setSuccess(false);
      setCurrentPin("");
      setNewPin("");
      setConfirm("");
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const p = await getUserPin(uid);
        setSavedPin(p);
      } catch (err) {
        setError(t("failedToLoadPin"));
      } finally {
        setLoading(false);
      }
    })();
  }, [uid, visible]);

  const isValidPin = (p: string) => /^\d{4}$/.test(p);

  /**
   * SUBMIT HANDLER
   * Executes multi-step validation before updating the database.
   */
  async function submit() {
    setError(null);

    // 1. Logic Validations
    if (!savedPin) return setError(t("noPinFound"));
    if (currentPin !== savedPin) return setError(t("wrongOldPin"));
    if (!isValidPin(newPin)) return setError(t("pinLengthError"));
    if (newPin !== confirm) return setError(t("pinsDoNotMatch"));
    if (newPin === currentPin) return setError(t("newPinSameAsOld"));

    try {
      await setUserPin(uid, newPin);
      setSuccess(true);

      // Auto-close after showing success message
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(t("updateFailed"));
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: theme.modalOverlay }]}>
        <View style={[styles.card, { backgroundColor: theme.modalBackground }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {t("changePin")}
          </Text>

          {loading ? (
            <ActivityIndicator
              color={theme.primary}
              size="large"
              style={{ margin: 20 }}
            />
          ) : (
            <>
              {/* CURRENT PIN INPUT */}
              <TextInput
                value={currentPin}
                onChangeText={setCurrentPin}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                placeholder={t("oldPinPlaceholder") || "Old PIN"}
                placeholderTextColor={theme.placeholder}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBackground,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
              />

              {/* NEW PIN INPUT */}
              <TextInput
                value={newPin}
                onChangeText={setNewPin}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                placeholder={t("newPinPlaceholder") || "New PIN"}
                placeholderTextColor={theme.placeholder}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBackground,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
              />

              {/* CONFIRMATION INPUT */}
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                placeholder={t("confirmPinPlaceholder") || "Confirm new PIN"}
                placeholderTextColor={theme.placeholder}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBackground,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
              />

              {/* STATUS MESSAGES */}
              {error && <Text style={styles.errorText}>{error}</Text>}

              {success && (
                <Text style={styles.successText}>
                  {t("pinUpdatedSuccessfully")} ✅
                </Text>
              )}

              {/* ACTIONS */}
              <Pressable
                onPress={submit}
                style={[styles.button, { backgroundColor: theme.primary }]}
              >
                <Text style={styles.buttonText}>{t("update")}</Text>
              </Pressable>

              <Pressable onPress={onClose} style={styles.cancelButton}>
                <Text style={{ color: theme.primary, fontWeight: "600" }}>
                  {t("cancel")}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 10, // Gives the dots space for better visibility
  },
  errorText: {
    color: "#FF4D4D",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  successText: {
    color: "#4BB543",
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 16,
    alignItems: "center",
  },
});
