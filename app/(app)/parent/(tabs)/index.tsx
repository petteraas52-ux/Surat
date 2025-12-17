import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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

import { useAbsenceManagement } from "@/hooks/useAbsenceManagement";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useCheckInOut } from "@/hooks/useCheckInOut";
import { useChildData } from "@/hooks/useChildData";
import { useGuestLink } from "@/hooks/useGuestLink";
import { useI18n } from "@/hooks/useI18n";

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

  const {
    anySelected,
    getButtonText,
    applyCheckInOut,
    toggleOverlayChildCheckIn,
    errorMessage: checkInError,
    clearError: clearCheckInError,
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
    errorMessage: absenceError,
    clearError: clearAbsenceError,
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
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log("[Index] Manual pull-to-refresh triggered");
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("[Index] Tab focused: Refreshing data via listener");
      refreshData();
    });
    return unsubscribe;
  }, [navigation, refreshData]);

  const activeChild = overlayChildId
    ? children.find((c) => c.id === overlayChildId)
    : undefined;

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

  if (loading && !refreshing) {
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
            colors={[theme.primary]}
          />
        }
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t("childrenHeader")}
        </Text>

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
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
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
