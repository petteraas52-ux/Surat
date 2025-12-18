/**
 * PARENT DASHBOARD (INDEX)
 * * ROLE:
 * The main control center for parents. It aggregates data from multiple hooks
 * to handle check-ins, absence reporting, and event viewing.
 * * ARCHITECTURE:
 * This screen follows a "Controller" pattern. It orchestrates several custom hooks
 * that contain the heavy business logic, keeping this UI file focused on
 * layout and user interactions.
 */

import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Custom Hooks - Separation of Concerns
import { useAbsenceManagement } from "@/hooks/useAbsenceManagement";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useCheckInOut } from "@/hooks/useCheckInOut";
import { useChildData } from "@/hooks/useChildData";
import { useGuestLink } from "@/hooks/useGuestLink";
import { useI18n } from "@/hooks/useI18n";

// Components
import { ChildCard } from "@/components/ChildCard";
import { AbsenceModal } from "@/components/modals/AbsenceModal";
import { CalendarModal } from "@/components/modals/CalendarModal";
import { ChildDetailModal } from "@/components/modals/ChildDetailModal";
import { GuestLinkModal } from "@/components/modals/GuestLinkModal";
import { formatDateShort, parseTimestampToDateString } from "@/utils/date";

export default function Index() {
  const { t } = useI18n();
  const theme = useAppTheme();
  const navigation = useNavigation();

  // --- DATA FETCHING & SYNC ---
  const {
    children,
    setChildren,
    events,
    loading,
    toggleSelect,
    errorMessage: childDataError,
    clearError: clearChildDataError,
    refreshData,
    lastUpdated,
  } = useChildData();

  // --- ATTENDANCE LOGIC ---
  const {
    anySelected,
    getButtonText,
    applyCheckInOut,
    toggleOverlayChildCheckIn,
    errorMessage: checkInError,
    clearError: clearCheckInError,
  } = useCheckInOut({ children, setChildren });

  // --- ABSENCE MANAGEMENT ---
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
    errorMessage: absenceError,
    clearError: clearAbsenceError,
  } = useAbsenceManagement({ children, setChildren });

  // --- GUEST PERMISSIONS ---
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

  // --- CALENDAR & EVENTS ---
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

  // --- LOCAL UI STATE ---
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayChildId, setOverlayChildId] = useState<string | null>(null);
  const [isSelectingVacationDate, setIsSelectingVacationDate] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // --- HANDLERS ---

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  /**
   * REFRESH ON FOCUS:
   * Ensures data is fresh whenever the parent returns to the app
   * or switches back from the Profile tab.
   */
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refreshData();
    });
    return unsubscribe;
  }, [navigation, refreshData]);

  const activeChild = useMemo(
    () => children.find((c) => c.id === overlayChildId),
    [children, overlayChildId]
  );

  const handleOpenDetailModal = useCallback((childId: string) => {
    setOverlayChildId(childId);
    setOverlayVisible(true);
  }, []);

  const handleOpenGuestLink = useCallback(() => {
    setOverlayVisible(false);
    openGuestLinkModal();
  }, [openGuestLinkModal]);

  /**
   * VACATION DATE PICKER:
   * Temporarily closes the absence form to show the calendar for date selection.
   */
  const handleOpenVacationDatePicker = useCallback(() => {
    closeAbsenceModal();
    setIsSelectingVacationDate(true);
    openCalendarModalForDate(vacationStartDate);
  }, [closeAbsenceModal, openCalendarModalForDate, vacationStartDate]);

  // STABLE LOADING STATE
  if (loading && children.length === 0 && !refreshing) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          {t("loadingChildren")}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t("childrenHeader")}
        </Text>

        {/* ERROR MESSAGES */}
        {childDataError && (
          <Text style={styles.errorText} onPress={clearChildDataError}>
            {childDataError}
          </Text>
        )}
        {checkInError && (
          <Text style={styles.errorText} onPress={clearCheckInError}>
            {checkInError}
          </Text>
        )}
        {absenceError && (
          <Text style={styles.errorText} onPress={clearAbsenceError}>
            {absenceError}
          </Text>
        )}

        {/* CHILD CARDS SECTION */}
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

        {/* UPCOMING EVENTS CARD */}
        <View style={{ marginTop: 24, marginBottom: 12 }}>
          <Text style={[styles.sectionHeader, { color: theme.text }]}>
            {t("upcommingEvent")}
          </Text>
          <Pressable
            style={[
              styles.upcomingCard,
              {
                backgroundColor: theme.cardBackground,
                shadowColor: theme.shadow,
              },
            ]}
            onPress={openCalendarModal}
          >
            {nextEvent ? (
              <View>
                <Text style={[styles.eventDate, { color: theme.primary }]}>
                  {formatDateShort(parseTimestampToDateString(nextEvent.date))}
                </Text>
                <Text style={[styles.eventTitle, { color: theme.text }]}>
                  {nextEvent.title}
                </Text>
                <Text
                  style={[styles.eventSubtitle, { color: theme.textSecondary }]}
                >
                  {t("department")}: {nextEvent.department}
                </Text>
              </View>
            ) : (
              <Text style={[styles.noEventText, { color: theme.textMuted }]}>
                {t("noEvents")}
              </Text>
            )}
          </Pressable>
        </View>

        {/* FOOTER ACTION BUTTONS */}
        <View style={styles.footerButtonsRow}>
          <Pressable
            style={[
              styles.absenceMainButtonWrapper,
              {
                backgroundColor: anySelected
                  ? theme.primary
                  : theme.inputBackground,
              },
            ]}
            onPress={openAbsenceModal}
            disabled={!anySelected}
          >
            <Text style={styles.footerButtonText}>{t("registerLeave")}</Text>
          </Pressable>

          <Pressable
            style={[styles.checkoutWrapper, { backgroundColor: theme.primary }]}
            onPress={applyCheckInOut}
          >
            <Text style={styles.footerButtonText}>{getButtonText()}</Text>
          </Pressable>
        </View>

        {/* METADATA INFO */}
        <View style={styles.footerInfo}>
          <Text
            style={[styles.lastUpdatedText, { color: theme.textSecondary }]}
          >
            {t("lastUpdated")}:{" "}
            {lastUpdated.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </ScrollView>

      {/* OVERLAY MODALS */}
      <ChildDetailModal
        isVisible={overlayVisible}
        activeChild={activeChild}
        onClose={() => setOverlayVisible(false)}
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
        onSendGuestLink={sendGuestLink}
        guestSending={guestSending}
        guestError={guestError}
      />

      <CalendarModal
        isVisible={calendarModalVisible}
        onClose={() => {
          setIsSelectingVacationDate(false);
          closeCalendarModal();
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
  safe: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  errorText: {
    color: "#dc2626",
    marginBottom: 8,
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
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventDate: {
    fontSize: 14,
    fontWeight: "600",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  eventSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  noEventText: {
    textAlign: "center",
    paddingVertical: 10,
  },
  footerButtonsRow: {
    flexDirection: "row",
    marginTop: 24,
  },
  absenceMainButtonWrapper: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  checkoutWrapper: {
    flex: 1,
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
  footerInfo: {
    marginTop: 30,
    alignItems: "center",
    paddingBottom: 10,
  },
  lastUpdatedText: {
    fontSize: 12,
    opacity: 0.6,
  },
});
