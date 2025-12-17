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
      <View
        style={[
          styles.overlayBackdrop,
          { backgroundColor: theme.modalOverlay },
        ]}
      >
        <View
          style={[
            styles.overlayCard,
            { backgroundColor: theme.modalBackground },
          ]}
        >
          <Pressable
            style={[styles.backButton, { backgroundColor: theme.primary }]}
            onPress={onClose}
          >
            <Text style={styles.backButtonText}>{t("close")}</Text>
          </Pressable>

          <Text style={[styles.calendarModalTitle, { color: theme.text }]}>
            {t("calendarHeader")}
          </Text>

          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            markingType="dot"
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
