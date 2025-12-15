import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// --- Custom Hooks (Handling all logic and state) ---
import { useAbsenceManagement } from "@/hooks/useAbsenceManagement";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useCheckInOut } from "@/hooks/useCheckInOut";
import { useChildData } from "@/hooks/useChildData";
import { useGuestLink } from "@/hooks/useGuestLink";

// --- Components & Utilities ---
import { ChildCard } from "@/components/ChildCard";
import { AbsenceModal } from "@/components/modals/AbsenceModal";
import { CalendarModal } from "@/components/modals/CalendarModal";
import { ChildDetailModal } from "@/components/modals/ChildDetailModal";
import { GuestLinkModal } from "@/components/modals/GuestLinkModal";
import { formatDateShort, parseTimestampToDateString } from "@/utils/date";

import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { children, setChildren, events, loading, toggleSelect } =
    useChildData();
  const {
    anySelected,
    getButtonText,
    applyCheckInOut,
    toggleOverlayChildCheckIn,
  } = useCheckInOut({ children, setChildren });
  const {
    absenceModalVisible,
    vacationDays,
    setVacationDays,
    vacationStartDate,
    setVacationStartDate,
    getAbsenceLabel,
    openAbsenceModal,
    closeAbsenceModal,
    registerSicknessTodayForSelected,
    registerVacationForSelected,
  } = useAbsenceManagement({ children, setChildren });
  const {
    guestLinkVisible,
    closeGuestLinkModal,
    guestName,
    setGuestName,
    guestPhone,
    setGuestPhone,
    guestSending,
    guestError,
    openGuestLinkModal,
    sendGuestLink,
  } = useGuestLink();
  const {
    calendarModalVisible,
    selectedDateInCalendar,
    markedDates,
    nextEvent,
    eventsForSelectedDate,
    onCalendarDayPress,
    openCalendarModal,
    closeCalendarModal,
    openCalendarModalForDate,
  } = useCalendarEvents({ events });

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayChildId, setOverlayChildId] = useState<string | null>(null);
  const [isSelectingVacationDate, setIsSelectingVacationDate] = useState(false);

  const activeChild = overlayChildId
    ? children.find((c) => c.id === overlayChildId)
    : undefined;

  const closeOverlay = () => setOverlayVisible(false);

  const handleOpenDetailModal = (childId: string) => {
    setOverlayChildId(childId);
    setOverlayVisible(true);
  };

  const handleOpenGuestLink = () => {
    setOverlayVisible(false);
    openGuestLinkModal();
  };

  const handleOpenVacationDatePicker = () => {
    closeAbsenceModal();
    setIsSelectingVacationDate(true);
    openCalendarModalForDate(vacationStartDate);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, styles.container]}>
        <ActivityIndicator size="large" color="#57507F" />
        <Text style={{ marginTop: 16 }}>Laster inn barnedata...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Mine Barn</Text>

        <View style={styles.childrenList}>
          {children.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              onSelect={() => toggleSelect(child.id)}
              onPress={() => handleOpenDetailModal(child.id)}
              absenceLabel={getAbsenceLabel(child)}
            />
          ))}
        </View>

        <View style={{ marginTop: 12, marginBottom: 12 }}>
          <Text style={styles.sectionHeader}>Kommende hendelse</Text>
          <Pressable style={styles.upcomingCard} onPress={openCalendarModal}>
            {nextEvent ? (
              <View>
                <Text style={styles.eventDate}>
                  {formatDateShort(parseTimestampToDateString(nextEvent.date))}
                </Text>
                <Text style={styles.eventTitle}>{nextEvent.title}</Text>
                <Text style={styles.eventSubtitle}>
                  Avdeling: {nextEvent.department}
                </Text>
              </View>
            ) : (
              <Text style={styles.noEventText}>
                Ingen kommende arrangementer registrert.
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.footerButtonsRow}>
          <Pressable
            style={[
              styles.absenceMainButtonWrapper,
              !anySelected && styles.absenceMainButtonDisabled,
            ]}
            onPress={openAbsenceModal}
            disabled={!anySelected}
          >
            <Text style={styles.footerButtonText}>Registrer fravær</Text>
          </Pressable>

          <Pressable style={styles.checkoutWrapper} onPress={applyCheckInOut}>
            <Text style={styles.footerButtonText}>{getButtonText()}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <ChildDetailModal
        isVisible={overlayVisible}
        activeChild={activeChild}
        onClose={closeOverlay}
        getAbsenceLabel={getAbsenceLabel}
        onOpenGuestLinkModal={handleOpenGuestLink}
        onToggleCheckIn={toggleOverlayChildCheckIn}
      />

      <AbsenceModal
        isVisible={absenceModalVisible}
        onClose={closeAbsenceModal}
        selectedChildrenCount={children.filter((c) => c.selected).length}
        vacationDays={vacationDays}
        setVacationDays={setVacationDays}
        vacationStartDate={vacationStartDate}
        onOpenStartDatePicker={handleOpenVacationDatePicker}
        onRegisterSickness={registerSicknessTodayForSelected}
        onRegisterVacation={registerVacationForSelected}
      />

      <GuestLinkModal
        isVisible={guestLinkVisible}
        onClose={closeGuestLinkModal}
        activeChild={activeChild}
        guestName={guestName}
        setGuestName={setGuestName}
        guestPhone={guestPhone}
        setGuestPhone={setGuestPhone}
        onSendGuestLink={(id) => sendGuestLink(id)}
        guestSending={guestSending}
        guestError={guestError}
      />

      <CalendarModal
        isVisible={calendarModalVisible}
        onClose={() => {
          if (isSelectingVacationDate) {
            setIsSelectingVacationDate(false);
            closeCalendarModal();
            openAbsenceModal();
          } else {
            closeCalendarModal();
          }
        }}
        markedDates={markedDates}
        selectedDate={selectedDateInCalendar}
        eventsForSelectedDate={eventsForSelectedDate}
        onDayPress={(day) => {
          if (isSelectingVacationDate) {
            setVacationStartDate(day.dateString);
            setIsSelectingVacationDate(false);
            closeCalendarModal();
            openAbsenceModal();
          } else {
            onCalendarDayPress(day);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF7ED" },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  childrenList: {
    flexDirection: "column",
  },
  sectionHeader: {
    fontWeight: "700",
    marginBottom: 8,
    fontSize: 16,
  },
  upcomingCard: {
    backgroundColor: "#EEEEED",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  eventDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#57507F",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  eventSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  noEventText: {
    color: "#999",
    textAlign: "center",
    paddingVertical: 10,
  },
  footerButtonsRow: {
    flexDirection: "row",
    marginTop: 24,
  },
  absenceMainButtonWrapper: {
    flex: 1,
    backgroundColor: "#57507F",
    marginRight: 8,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  absenceMainButtonDisabled: {
    backgroundColor: "#ddd",
  },
  checkoutWrapper: {
    flex: 1,
    backgroundColor: "#57507F",
    marginLeft: 8,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  footerButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
