/**
 * CALENDAR MODAL COMPONENT
 * * ROLE:
 * A specialized UI overlay that provides a monthly calendar view and a
 * corresponding list of events for the selected date.
 * * CORE FUNCTIONALITY:
 * 1. Interactive Calendar: Integrates 'react-native-calendars' to visualize
 * dates with markers (dots) indicating scheduled activities.
 * 2. Event List Synchronization: Dynamically displays a scrollable list of
 * EventProps cards based on the 'selectedDate' passed via props.
 * 3. Deep Theming: Maps global theme tokens to the internal styling of
 * the third-party Calendar component for a seamless look.
 * 4. Localization: Uses i18n for headers, button labels, and empty-state messaging.
 */

import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { EventProps } from "@/types/eventData";
import { formatDateShort } from "@/utils/date";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";

interface CalendarModalProps {
  isVisible: boolean;
  onClose: () => void;
  markedDates: Record<string, any>;
  selectedDate: string | null;
  eventsForSelectedDate: EventProps[];
  onDayPress: (day: DateData) => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isVisible,
  onClose,
  markedDates,
  selectedDate,
  eventsForSelectedDate,
  onDayPress,
}) => {
  const { t } = useI18n();
  const theme = useAppTheme();

  /**
   * renderEvent
   * A helper function that transforms an EventProps object into a styled card.
   * Utilizes the 'borderLeftWidth' as a visual accent using the primary theme color.
   */
  const renderEvent = (event: EventProps, index: number) => (
    <View
      key={index}
      style={[
        styles.eventItem,
        {
          backgroundColor: theme.cardBackground,
          borderLeftColor: theme.primary,
        },
      ]}
    >
      <Text style={[styles.eventTitle, { color: theme.text }]}>
        {event.title}
      </Text>
      <Text style={[styles.eventSubtitle, { color: theme.primary }]}>
        {t("department")}: {event.department}
      </Text>
      {event.description && (
        <Text style={[styles.eventDescription, { color: theme.textSecondary }]}>
          {event.description}
        </Text>
      )}
    </View>
  );

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      {/* BACKGROUND OVERLAY */}
      <View
        style={[
          styles.overlayBackdrop,
          { backgroundColor: theme.modalOverlay },
        ]}
      >
        {/* MODAL CONTAINER */}
        <View
          style={[
            styles.overlayCard,
            { backgroundColor: theme.modalBackground },
          ]}
        >
          {/* HEADER SECTION: CLOSE BUTTON & TITLE */}
          <Pressable
            style={[styles.backButton, { backgroundColor: theme.primary }]}
            onPress={onClose}
          >
            <Text style={styles.backButtonText}>{t("close")}</Text>
          </Pressable>

          <Text style={[styles.calendarModalTitle, { color: theme.text }]}>
            {t("calendarHeader")}
          </Text>

          {/* INTERACTIVE CALENDAR SECTION */}
          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            markingType="dot"
            // Integration of custom theme tokens into the Calendar library
            theme={{
              backgroundColor: theme.backgroundSecondary,
              calendarBackground: theme.backgroundSecondary,
              textSectionTitleColor: theme.text,
              selectedDayBackgroundColor: theme.secondary,
              selectedDayTextColor: theme.text,
              todayTextColor: theme.primary,
              dayTextColor: theme.text,
              textDisabledColor: theme.textMuted,
              dotColor: theme.primary,
              selectedDotColor: theme.primary,
              arrowColor: theme.primary,
              monthTextColor: theme.primary,
              indicatorColor: theme.primary,
              textDayFontWeight: "400",
              textMonthFontWeight: "700",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            style={[
              styles.calendarStyle,
              {
                shadowColor: theme.shadow,
                backgroundColor: theme.backgroundSecondary,
              },
            ]}
          />

          {/* DYNAMIC EVENT LIST SECTION */}
          <View
            style={[
              styles.eventsContainer,
              { borderTopColor: theme.borderLight },
            ]}
          >
            <Text style={[styles.eventsHeader, { color: theme.text }]}>
              {t("eventsPlural")}:{" "}
              {selectedDate ? formatDateShort(selectedDate) : t("choseDate")}
            </Text>

            <ScrollView style={styles.eventsList}>
              {/* Conditional rendering: Show list of events or an empty state message */}
              {eventsForSelectedDate.length > 0 ? (
                eventsForSelectedDate.map(renderEvent)
              ) : (
                <Text style={[styles.noEventsText, { color: theme.textMuted }]}>
                  {selectedDate ? t("noEventsToday") : t("noDateSelected")}
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// STYLESHEET DEFINITIONS
const styles = StyleSheet.create({
  overlayBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  overlayCard: {
    width: "100%",
    maxHeight: "75%",
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    flex: 1,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  calendarModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  calendarStyle: {
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    marginBottom: 16,
  },
  eventsContainer: {
    flex: 1,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  eventsHeader: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  eventsList: {
    flexGrow: 1,
  },
  eventItem: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  eventTitle: {
    fontWeight: "700",
    fontSize: 16,
  },
  eventSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  eventDescription: {
    fontSize: 13,
    marginTop: 6,
  },
  noEventsText: {
    textAlign: "center",
    marginTop: 20,
  },
});
