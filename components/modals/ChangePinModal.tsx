import { getUserPin, setUserPin } from "@/api/pinApi";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
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
  const [savedPin, setSavedPin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!visible) return;

    (async () => {
      setLoading(true);
      const p = await getUserPin(uid);
      setSavedPin(p);
      setLoading(false);
    })();
  }, [uid, visible]);

  const isValidPin = (p: string) => /^\d{4}$/.test(p);

  async function submit() {
    setError(null);

    if (!savedPin) return setError("Du har ingen PIN ennå.");
    if (currentPin !== savedPin) return setError("Gammel PIN er feil.");
    if (!isValidPin(newPin)) return setError("Ny PIN må være 4 siffer.");
    if (newPin !== confirm) return setError("PIN-kodene er ikke like.");

    await setUserPin(uid, newPin);

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      onClose();
      setCurrentPin("");
      setNewPin("");
      setConfirm("");
    }, 2000);
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{ backgroundColor: "white", borderRadius: 12, padding: 16 }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
            t{"changePin"}
          </Text>

          {loading ? (
            <ActivityIndicator />
          ) : (
            <>
              <TextInput
                value={currentPin}
                onChangeText={setCurrentPin}
                keyboardType="number-pad"
                secureTextEntry
                placeholder="Gammel PIN"
                style={inputStyle}
              />
              <TextInput
                value={newPin}
                onChangeText={setNewPin}
                keyboardType="number-pad"
                secureTextEntry
                placeholder="Ny PIN"
                style={inputStyle}
              />
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                keyboardType="number-pad"
                secureTextEntry
                placeholder="Bekreft ny PIN"
                style={inputStyle}
              />

              {error && (
                <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
              )}

              {success && (
                <Text
                  style={{
                    color: "green",
                    marginBottom: 12,
                    fontWeight: "600",
                  }}
                >
                  PIN er oppdatert ✅
                </Text>
              )}

              <Pressable onPress={submit} style={buttonStyle}>
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Oppdater
                </Text>
              </Pressable>

              <Pressable
                onPress={onClose}
                style={{ marginTop: 10, alignItems: "center" }}
              >
                <Text style={{ color: "#57507F", fontWeight: "600" }}>
                  Avbryt
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  padding: 12,
  fontSize: 16,
  marginBottom: 10,
  backgroundColor: "#fafafa",
  letterSpacing: 0,
} as const;

const buttonStyle = {
  backgroundColor: "#57507F",
  padding: 12,
  borderRadius: 10,
  alignItems: "center",
} as const;
