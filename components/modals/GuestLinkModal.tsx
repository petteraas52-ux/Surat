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
  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlayBackdrop}>
        <View style={[styles.overlayCard, { alignItems: "center" }]}>
          <Pressable style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>Tilbake</Text>
          </Pressable>

          <Text style={styles.fetchTitle}>
            {activeChild
              ? `${activeChild.firstName} ${activeChild.lastName}`
              : "Hentebarn"}
          </Text>

          <View style={styles.fetchAvatar}>
            <Text style={{ fontSize: 36 }}>👶</Text>
          </View>

          <Text style={styles.fetchSubtitle}>Fyll inn hvem som skal hente</Text>

          <Text style={styles.inputLabel}>Navn:</Text>
          <TextInput
            style={styles.input}
            value={guestName}
            onChangeText={setGuestName}
            placeholder="Skriv navn"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>Telefonnummer:</Text>
          <TextInput
            style={styles.input}
            value={guestPhone}
            onChangeText={setGuestPhone}
            placeholder="Skriv telefonnummer"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />

          <Pressable
            style={[
              styles.purpleButton,
              {
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
              {guestSending ? "Sender..." : "Send hentemelding"}
            </Text>
          </Pressable>

          {guestError && (
            <Text style={{ color: "red", marginTop: 8 }}>{guestError}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  overlayCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 6,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#57507F",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  backButtonText: { color: "#fff", fontWeight: "700" },
  purpleButton: {
    flex: 1,
    backgroundColor: "#57507F",
    marginHorizontal: 4,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  fetchTitle: { fontSize: 22, fontWeight: "700", marginVertical: 12 },
  fetchSubtitle: { fontSize: 16, marginBottom: 12 },
  fetchAvatar: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  inputLabel: { alignSelf: "flex-start", marginBottom: 4, fontWeight: "600" },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 12,
  },
});
