import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Child = {
  id: number;
  name: string;
  checkedIn: boolean;
  selected: boolean;
};

export default function Index() {
  const [children, setChildren] = useState<Child[]>([
    { id: 1, name: "Roar Johnny", checkedIn: false, selected: false },
    { id: 2, name: "Andrefødte", checkedIn: false, selected: false },
  ]);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayChildId, setOverlayChildId] = useState<number | null>(null);

  const openOverlay = (childId: number) => {
    setOverlayChildId(childId);
    setOverlayVisible(true);
  };

  const closeOverlay = () => {
    setOverlayVisible(false);
    setOverlayChildId(null);
  };

  const toggleSelect = (id: number) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === id ? { ...child, selected: !child.selected } : child
      )
    );
  };

  const getButtonText = (): string => {
    const selected = children.filter((c) => c.selected);
    if (selected.length === 0) return "Velg barn";

    const allCheckedIn = selected.every((c) => c.checkedIn);
    const allCheckedOut = selected.every((c) => !c.checkedIn);

    if (allCheckedIn) return "Sjekk ut";
    if (allCheckedOut) return "Sjekk inn";
    return "Oppdater status";
  };

  const applyCheckInOut = () => {
    const selected = children.filter((c) => c.selected);
    if (selected.length === 0) return;

    const allCheckedIn = selected.every((c) => c.checkedIn);

    setChildren((prev) =>
      prev.map((child) =>
        child.selected
          ? { ...child, checkedIn: !allCheckedIn, selected: false }
          : child
      )
    );
  };

  const toggleOverlayChildCheckIn = () => {
    if (overlayChildId == null) return;
    setChildren((prev) =>
      prev.map((child) =>
        child.id === overlayChildId
          ? { ...child, checkedIn: !child.checkedIn }
          : child
      )
    );
  };

  const activeChild =
    overlayChildId != null
      ? children.find((c) => c.id === overlayChildId)
      : undefined;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Mine barn</Text>

        {children.map((child) => (
          <Pressable
            key={child.id}
            onPress={() => openOverlay(child.id)}
            style={styles.childCard}
          >
            <View style={styles.avatarPlaceholder}>
              <Text style={{ fontSize: 28 }}>🙋‍♂️</Text>
            </View>

            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text
                style={[
                  styles.childStatus,
                  child.checkedIn ? styles.statusIn : styles.statusOut,
                ]}
              >
                {child.checkedIn ? "Sjekket inn" : "Sjekket ut"}
              </Text>
            </View>

            <Pressable
              onPress={() => toggleSelect(child.id)}
              style={[styles.circle, child.selected && styles.circleSelected]}
            >
              {child.selected && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
          </Pressable>
        ))}

        <Pressable style={styles.checkoutWrapper} onPress={applyCheckInOut}>
          <View style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>{getButtonText()}</Text>
          </View>
        </Pressable>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={overlayVisible} transparent animationType="fade">
        <View style={styles.overlayBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeOverlay} />

          <View style={styles.overlayCard}>
            {activeChild && (
              <>
                {/* Profilkort */}
                <View style={styles.profileCard}>
                  <View style={styles.profileRow}>
                    <View style={styles.profileAvatar}>
                      <Text style={{ fontSize: 28 }}>👶</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.profileName}>{activeChild.name}</Text>
                      <Text style={styles.profileStatusText}>
                        {activeChild.checkedIn ? "Sjekket inn" : "Sjekket ut"}
                      </Text>
                    </View>

                  </View>
                </View>

                {/* Bunnknapper */}
                <View style={styles.bottomButtons}>
                  <Pressable style={styles.purpleButton}>
                    <Text style={styles.purpleButtonText}>Opprett gjest-linke</Text>
                  </Pressable>

                  <Pressable
                    style={styles.purpleButton}
                    onPress={toggleOverlayChildCheckIn}
                  >
                    <Text style={styles.purpleButtonText}>
                      {activeChild.checkedIn ? "Sjekk ut" : "Sjekk inn"}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#ffff" 
  },

  container: { 
    padding: 24, 
    paddingBottom: 40 
  },

  title: { 
    fontSize: 30, 
    fontWeight: "700", 
    textAlign: "center", 
    marginBottom: 40 
  },

  childCard: {
    backgroundColor: "#57507F",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "#403A63", 
    alignItems: "center", 
    justifyContent: "center",
    marginRight: 16,
  },
  childInfo: { flex: 1 },

  childName: { 
    color: "white", 
    fontSize: 20, 
    fontWeight: "700" 
  },

  childStatus: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginTop: 2 
  },

  statusIn: { color: "#00C853" },

  statusOut: { color: "#FF5252" },

  circle: {
    width: 36, height: 36, 
    borderRadius: 18,
    backgroundColor: "white", 
    alignItems: "center", 
    justifyContent: "center",
  },

  circleSelected: { backgroundColor: "#BCA9FF" },

  checkmark: { 
    color: "white", 
    fontSize: 20, 
    fontWeight: "700" 
  },

  checkoutWrapper: { 
    alignItems: "center", 
    marginTop: 16 
  },

  checkoutButton: {
    backgroundColor: "#57507F",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50, width: "80%", alignItems: "center",
  },

  checkoutText: { 
    color: "white", 
    fontSize: 18, 
    fontWeight: "700" 
  },

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

  profileCard: {
    backgroundColor: "#9A96FF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  profileStatusText: {
    fontSize: 14,
    color: "#f2f2f2",
    marginTop: 2,
  },
  
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  purpleButton: {
    flex: 1,
    backgroundColor: "#57507F",
    marginHorizontal: 4,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  purpleButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
