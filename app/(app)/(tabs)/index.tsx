import { getAllEvents } from "@/api/event";
import { db } from "@/firebaseConfig";
import { ChildProps } from "@/types/child";
import { EventProps } from "@/types/event";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

type UIChild = ChildProps & { selected?: boolean };

export default function Index() {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const [children, setChildren] = useState<UIChild[]>([]);
  const [events, setEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(true);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayChildId, setOverlayChildId] = useState<string | null>(null);
  const [guestLinkVisible, setGuestLinkVisible] = useState(false);

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [selectedDateInCalendar, setSelectedDateInCalendar] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!uid) return;

    const loadChildren = async () => {
      try {
        const childrenCol = collection(db, "children");
        const q = query(childrenCol, where("parents", "array-contains", uid));
        const snap = await getDocs(q);

        const data: UIChild[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ChildProps, "id">),
          selected: false,
        }));

        setChildren(data);
      } catch (err) {
        console.error("Failed to load children:", err);
      }
    };

    const loadEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    };

    loadChildren();
    loadEvents();
  }, [uid]);

  const openOverlay = (childId: string) => {
    setOverlayChildId(childId);
    setOverlayVisible(true);
  };

  const closeOverlay = () => {
    setOverlayVisible(false);
    setOverlayChildId(null);
  };

  const openGuestLinkModal = () => {
    setOverlayVisible(false);
    setGuestLinkVisible(true);
  };

  const closeGuestLinkModal = () => {
    setGuestLinkVisible(false);
    setGuestName("");
    setGuestPhone("");
  };

  const toggleSelect = (id: string) => {
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

  const applyCheckInOut = async () => {
    const selected = children.filter((c) => c.selected);
    if (selected.length === 0) return;

    const allCheckedIn = selected.every((c) => c.checkedIn);

    const updatedChildren = children.map((child) =>
      child.selected
        ? { ...child, checkedIn: !allCheckedIn, selected: false }
        : child
    );
    setChildren(updatedChildren);

    for (const child of selected) {
      await updateDoc(doc(db, "children", child.id), {
        checkedIn: !allCheckedIn,
      });
    }
  };

  const toggleOverlayChildCheckIn = async () => {
    if (!overlayChildId) return;

    const child = children.find((c) => c.id === overlayChildId);
    if (!child) return;

    const newStatus = !child.checkedIn;
    setChildren((prev) =>
      prev.map((c) =>
        c.id === overlayChildId ? { ...c, checkedIn: newStatus } : c
      )
    );

    await updateDoc(doc(db, "children", overlayChildId), {
      checkedIn: newStatus,
    });
  };

  const parseTimestampToDateString = (ts: any): string => {
    const dateObj = ts.toDate ? ts.toDate() : new Date(ts);
    return dateObj.toISOString().split("T")[0];
  };

  const parseISODateToLocal = (iso: string): Date => {
    const [y, m, d] = iso.split("-").map((s) => parseInt(s, 10));
    return new Date(y, m - 1, d);
  };

  const markedDates = useMemo(() => {
    const m: Record<string, any> = {};
    const counts: Record<string, number> = {};

    events.forEach((ev) => {
      const dateStr = parseTimestampToDateString(ev.date);
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    events.forEach((ev) => {
      const dateStr = parseTimestampToDateString(ev.date);
      m[dateStr] = {
        marked: true,
        dotColor: "#57507F",
        eventCount: counts[dateStr],
      };
    });

    if (selectedDateInCalendar) {
      m[selectedDateInCalendar] = {
        ...(m[selectedDateInCalendar] || {}),
        selected: true,
        selectedColor: "#BCA9FF",
      };
    }

    return m;
  }, [events, selectedDateInCalendar]);

  const nextEvent = useMemo(() => {
    if (!events.length) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const future = events
      .map((ev) => ({
        ...ev,
        time: parseISODateToLocal(parseTimestampToDateString(ev.date)),
      }))
      .filter((ev) => ev.time.getTime() >= today.getTime())
      .sort((a, b) => a.time.getTime() - b.time.getTime());

    return future.length ? future[0] : null;
  }, [events]);

  const onCalendarDayPress = (day: DateData) =>
    setSelectedDateInCalendar(day.dateString);

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDateInCalendar) return [];
    return events.filter(
      (ev) => parseTimestampToDateString(ev.date) === selectedDateInCalendar
    );
  }, [events, selectedDateInCalendar]);

  const activeChild = overlayChildId
    ? children.find((c) => c.id === overlayChildId)
    : undefined;

  if (loading)
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Mine barn</Text>

        {children.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 50, fontSize: 18 }}>
            Ingen barn registrert
          </Text>
        ) : (
          children.map((child) => (
            <Pressable
              key={child.id}
              onPress={() => openOverlay(child.id)}
              style={styles.childCard}
            >
              <View style={styles.avatarPlaceholder}>
                <Text style={{ fontSize: 28 }}>🙋‍♂️</Text>
              </View>
              <View style={styles.childInfo}>
                <Text style={styles.childName}>
                  {child.firstName} {child.lastName}
                </Text>
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
          ))
        )}

        <View style={{ marginTop: 12, marginBottom: 12 }}>
          <Text style={{ fontWeight: "700", marginBottom: 8 }}>
            Kommende hendelse
          </Text>
          <Pressable
            style={styles.upcomingCard}
            onPress={() => {
              setCalendarModalVisible(true);
              if (nextEvent)
                setSelectedDateInCalendar(
                  parseTimestampToDateString(nextEvent.date)
                );
            }}
          >
            {nextEvent ? (
              <View>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>
                  {nextEvent.title}
                </Text>
                <Text style={{ color: "#666", marginTop: 4 }}>
                  {nextEvent.department}
                </Text>
                <Text style={{ color: "#666", marginTop: 4 }}>
                  {parseTimestampToDateString(nextEvent.date)}
                </Text>
              </View>
            ) : (
              <Text style={{ color: "#666" }}>Ingen kommende hendelser</Text>
            )}
          </Pressable>
        </View>

        <Pressable style={styles.checkoutWrapper} onPress={applyCheckInOut}>
          <View style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>{getButtonText()}</Text>
          </View>
        </Pressable>

        <Modal visible={overlayVisible} transparent animationType="fade">
          <View style={styles.overlayBackdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeOverlay} />
            <View style={styles.overlayCard}>
              <Pressable style={styles.backButton} onPress={closeOverlay}>
                <Text style={styles.backButtonText}>Tilbake</Text>
              </Pressable>
              {activeChild && (
                <>
                  <View style={styles.profileCard}>
                    <View style={styles.profileRow}>
                      <View style={styles.profileAvatar}>
                        <Text style={{ fontSize: 28 }}>👶</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.profileName}>
                          {activeChild.firstName} {activeChild.lastName}
                        </Text>
                        <Text style={styles.profileStatusText}>
                          {activeChild.checkedIn ? "Sjekket inn" : "Sjekket ut"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.bottomButtons}>
                    <Pressable
                      style={styles.purpleButton}
                      onPress={openGuestLinkModal}
                    >
                      <Text style={styles.purpleButtonText}>
                        Opprett gjest-linke
                      </Text>
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

        <Modal visible={calendarModalVisible} transparent animationType="slide">
          <View style={styles.overlayBackdrop}>
            <View style={[styles.overlayCard, { maxHeight: "90%" }]}>
              <Pressable
                style={styles.backButton}
                onPress={() => setCalendarModalVisible(false)}
              >
                <Text style={styles.backButtonText}>Lukk</Text>
              </Pressable>
              <Calendar
                onDayPress={onCalendarDayPress}
                markedDates={markedDates}
                style={{ borderRadius: 8 }}
                theme={{ todayTextColor: "#57507F" }}
              />
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontWeight: "700", marginBottom: 6 }}>
                  Hendelser{" "}
                  {selectedDateInCalendar ? `– ${selectedDateInCalendar}` : ""}
                </Text>
                {selectedDateInCalendar ? (
                  eventsForSelectedDate.length === 0 ? (
                    <Text style={{ color: "#666" }}>
                      Ingen hendelser denne dagen
                    </Text>
                  ) : (
                    eventsForSelectedDate.map((ev) => (
                      <View key={ev.id} style={{ paddingVertical: 6 }}>
                        <Text style={{ fontWeight: "600" }}>{ev.title}</Text>
                        <Text style={{ color: "#666" }}>
                          Avdeling: {ev.department}
                        </Text>
                        <Text style={{ color: "#666", marginTop: 10 }}>
                          {ev.description}
                        </Text>
                      </View>
                    ))
                  )
                ) : (
                  <Text style={{ color: "#666" }}>
                    Velg en dato for å se hendelser
                  </Text>
                )}
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={guestLinkVisible} transparent animationType="slide">
          <View style={styles.overlayBackdrop}>
            <View style={[styles.overlayCard, { alignItems: "center" }]}>
              <Pressable
                style={styles.backButton}
                onPress={closeGuestLinkModal}
              >
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
              <Text style={styles.fetchSubtitle}>
                Fyll inn hvem som skal hente
              </Text>
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
                  { marginTop: 24, flex: undefined, alignSelf: "stretch" },
                ]}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
                >
                  Send hentemelding
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffff" },
  container: { padding: 24, paddingBottom: 40 },
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
  childInfo: { flex: 1 },
  childName: { color: "white", fontSize: 20, fontWeight: "700" },
  childStatus: { fontSize: 16, fontWeight: "600", marginTop: 2 },
  statusIn: { color: "#00C853" },
  statusOut: { color: "#FF5252" },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  circleSelected: { backgroundColor: "#BCA9FF" },
  checkmark: { color: "white", fontSize: 20, fontWeight: "700" },
  checkoutWrapper: { alignItems: "center", marginTop: 16 },
  checkoutButton: {
    backgroundColor: "#57507F",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    width: "80%",
    alignItems: "center",
  },
  checkoutText: { color: "white", fontSize: 18, fontWeight: "700" },
  upcomingCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
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
  profileRow: { flexDirection: "row", alignItems: "center" },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  profileName: { fontSize: 20, fontWeight: "700", color: "#fff" },
  profileStatusText: { fontSize: 14, color: "#f2f2f2", marginTop: 2 },
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
  purpleButtonText: { color: "#fff", fontWeight: "700" },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#57507F",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  backButtonText: { color: "#fff", fontWeight: "700" },
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