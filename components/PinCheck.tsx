/**
 * PIN CHECK COMPONENT
 * * ROLE:
 * Prevents unauthorized access to sensitive actions (e.g., admin panels,
 * child pickup, or editing profile data).
 * * KEY FEATURES:
 * 1. Intelligent UI: Swaps icons (lock-closed vs lock-open) and labels
 * based on whether the user is creating or entering a PIN.
 * 2. Letter Spacing Logic: Adds 15px spacing when a user types to mimic
 * separate digit boxes without the complexity of 4 separate inputs.
 * 3. Error Feedback: Provides localized alerts for non-matching PINs
 * or incorrect entries.
 */

import { getUserPin, setUserPin } from "@/api/pinApi";
import { styles as commonStyles } from "@/components/modals/commonStyles";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function PinCheck({
  uid,
  onUnlocked,
}: {
  uid: string;
  onUnlocked: () => void;
}) {
  const theme = useAppTheme();
  const { t } = useI18n();

  const [savedPin, setSavedPin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    (async () => {
      const p = await getUserPin(uid);
      setSavedPin(p);
      setLoading(false);
    })();
  }, [uid]);

  const isValidPin = (p: string) => /^\d{4}$/.test(p);

  async function submit() {
    setError(null);
    if (!savedPin) {
      // SETUP FLOW
      if (!isValidPin(pin)) return setError(t("pinLengthError"));
      if (pin !== confirm) return setError(t("pinMatchError"));

      await setUserPin(uid, pin);
      setSavedPin(pin);
      setPin("");
      setConfirm("");
      onUnlocked();
      return;
    }

    // UNLOCK FLOW
    if (pin === savedPin) {
      setPin("");
      onUnlocked();
    } else {
      setError(t("invalidPin"));
    }
  }

  if (loading) {
    return (
      <View
        style={[commonStyles.center, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const title = savedPin ? t("enterPin") : t("createPin");
  const canSubmit = savedPin
    ? pin.trim().length === 4
    : pin.trim().length === 4 && confirm.trim().length === 4;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={[localStyles.container, { backgroundColor: theme.background }]}
      >
        {/* LOCK ICON */}
        <View
          style={[
            localStyles.iconCircle,
            { backgroundColor: theme.primary + "15" },
          ]}
        >
          <Ionicons
            name={savedPin ? "lock-closed" : "lock-open"}
            size={40}
            color={theme.primary}
          />
        </View>

        <Text
          style={[
            commonStyles.title,
            { color: theme.text, textAlign: "center" },
          ]}
        >
          {title}
        </Text>

        <Text style={[localStyles.subtitle, { color: theme.textSecondary }]}>
          {savedPin ? t("enterPinSubtitle") : t("createPinSubtitle")}
        </Text>

        <View style={localStyles.inputWrapper}>
          <TextInput
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            placeholder={savedPin ? "••••" : t("newPin")}
            placeholderTextColor={theme.textMuted}
            style={[
              commonStyles.input,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                color: theme.text,
                textAlign: "center",
                fontSize: 28, // Large digits for visibility
                height: 70,
                letterSpacing: pin.length > 0 ? 15 : 0,
              },
            ]}
          />

          {/* SECONDARY INPUT FOR SETUP ONLY */}
          {!savedPin && (
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
              placeholder={t("confirmPin")}
              placeholderTextColor={theme.textMuted}
              style={[
                commonStyles.input,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  color: theme.text,
                  marginTop: 12,
                  textAlign: "center",
                  fontSize: 28,
                  height: 70,
                  letterSpacing: confirm.length > 0 ? 15 : 0,
                },
              ]}
            />
          )}
        </View>

        {error && (
          <View style={localStyles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={theme.error} />
            <Text style={[localStyles.errorText, { color: theme.error }]}>
              {error}
            </Text>
          </View>
        )}

        <Pressable
          onPress={submit}
          style={[
            commonStyles.createButton,
            {
              width: "100%",
              backgroundColor: canSubmit ? theme.primary : theme.primary + "50",
            },
          ]}
          disabled={!canSubmit}
        >
          <Text style={commonStyles.createButtonText}>
            {savedPin ? t("unlock") : t("savePin")}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    alignItems: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  errorText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },
});
