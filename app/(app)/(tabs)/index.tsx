
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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

  const toggleSelect = (id: number) => {
    setChildren(prev =>
      prev.map(child =>
        child.id === id ? { ...child, selected: !child.selected } : child
      )
    );
  };

  const getButtonText = (): string => {
    const selected = children.filter(c => c.selected);

    if (selected.length === 0) return "Velg barn";

    const allCheckedIn = selected.every(c => c.checkedIn);
    const allCheckedOut = selected.every(c => !c.checkedIn);

    if (allCheckedIn) return "Sjekk ut";
    if (allCheckedOut) return "Sjekk inn";

    return "Oppdater status";
  };

  const applyCheckInOut = () => {
    const selected = children.filter(c => c.selected);
    if (selected.length === 0) return;

    const allCheckedIn = selected.every(c => c.checkedIn);

    setChildren(prev =>
      prev.map(child =>
        child.selected
          ? {
              ...child,
              checkedIn: !allCheckedIn, // hvis alle var inn, sett ut; ellers sett inn
              selected: false,
            }
          : child
      )
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Mine barn</Text>

        {children.map(child => (
          <View key={child.id} style={styles.childCard}>
            <View style={styles.avatarPlaceholder}>
              <Text style={{ fontSize: 28 }}>🙋‍♂️</Text>
            </View>

            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.name}</Text>

              {/* Betinget farge på status-teksten */}
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
              accessibilityRole="checkbox"
              accessibilityState={{ checked: child.selected }}
              accessibilityLabel={`Velg ${child.name}`}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {child.selected && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
          </View>
        ))}
       <Text style={styles.calendarText}>Barnas kalender</Text>
        <View style={styles.calendar}>
          <Text style={{ color: "black" }}>Kalender kommer her</Text>
        </View>

        <Pressable style={styles.checkoutWrapper} onPress={applyCheckInOut}>
          <View style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>{getButtonText()}</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#403A63",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },

  // Basis-stil for status-tekst
  childStatus: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  // Grønn ved "Sjekket inn"
  statusIn: {
    color: "#00C853",
  },
  // Rød ved "Sjekket ut"
  statusOut: {
    color: "#FF5252",
  },

  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  circleSelected: {
    backgroundColor: "#BCA9FF",
  },
  checkmark: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  
  calendarText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  calendar: {
    backgroundColor: "#f0f0f0",
    height: 180,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  checkoutWrapper: {
    alignItems: "center",
    marginTop: 16,
  },
  checkoutButton: {
    backgroundColor: "#57507F",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    width: "80%",
    alignItems: "center",
  },
  checkoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
