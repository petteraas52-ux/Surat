
import { useRouter } from "expo-router"; 
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars"; // 👈 legg til
import { SafeAreaView } from "react-native-safe-area-context";

type Child = {
  id: number;
  name: string;
  checkedIn: boolean;
  selected: boolean;
};

export default function Index() {
  const router = useRouter(); 

  const [children, setChildren] = useState<Child[]>([
    { id: 1, name: "Roar Johnny", checkedIn: false, selected: false },
    { id: 2, name: "Andrefødte", checkedIn: false, selected: false },
  ]);

  // Kalender-state
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});

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
          ? {
              ...child,
              checkedIn: !allCheckedIn,
              selected: false,
            }
          : child
      )
    );
  };

  // Håndter dag-trykk i kalenderen
  const onDayPress = (day: DateData) => {
    const date = day.dateString; // "YYYY-MM-DD"
    setSelectedDate(date);
    setMarkedDates({
      [date]: {
        selected: true,
        selectedColor: "#57507F",
        selectedTextColor: "#fff",
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Mine barn</Text>

        {children.map((child) => (
          <Pressable
          key={child.id}
          style={styles.childCard}
          onPress={() => router.push(`/children/${child.id}`)
        }
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
              accessibilityRole="checkbox"
              accessibilityState={{ checked: child.selected }}
              accessibilityLabel={`Velg ${child.name}`}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPressIn={(e) => e.stopPropagation()}
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

        <Text style={styles.calendarText}>Barnas kalender</Text>

        {/* 🗓 Kalender her */}
        <View style={styles.calendar}>
          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            theme={{
              todayTextColor: "#57507F",
              arrowColor: "#57507F",
              selectedDayBackgroundColor: "#57507F",
              selectedDayTextColor: "#ffffff",
              monthTextColor: "#000",
              dayTextColor: "#000",
              textSectionTitleColor: "#888",
            }}
            // optional: min/max, start uke på mandag, etc.
            firstDay={1}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffff" },
  container: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 30, fontWeight: "700", textAlign: "center", marginBottom: 40 },

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
    backgroundColor: "#403A63", alignItems: "center", justifyContent: "center",
    marginRight: 16,
  },
  childInfo: { flex: 1 },
  childName: { color: "white", fontSize: 20, fontWeight: "700" },

  childStatus: { fontSize: 16, fontWeight: "600", marginTop: 2 },
  statusIn: { color: "#00C853" },
  statusOut: { color: "#FF5252" },

  circle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "white", alignItems: "center", justifyContent: "center",
  },
  circleSelected: { backgroundColor: "#BCA9FF" },
  checkmark: { color: "white", fontSize: 20, fontWeight: "700" },

   checkoutWrapper: { alignItems: "center", marginTop: 16 },
  checkoutButton: {
    backgroundColor: "#57507F",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50, width: "80%", alignItems: "center",
  },
  checkoutText: { color: "white", fontSize: 18, fontWeight: "700" },

  calendarText: { fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 10 },
  calendar: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 8,
    // Fjern fast høyde så kalenderen får plass:
    // height: 180,
    alignItems: "stretch",
    justifyContent: "center",
    marginBottom: 40,
  },

});
