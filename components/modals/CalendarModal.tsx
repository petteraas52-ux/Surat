import { EventProps } from "@/types/event";
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
  const renderEvent = (event: EventProps, index: number) => (
    <View key={index} style={styles.eventItem}>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventSubtitle}>Avdeling: {event.department}</Text>
      {event.description && (
        <Text style={styles.eventDescription}>{event.description}</Text>
      )}
    </View>
  );

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlayBackdrop}>
        <View style={styles.overlayCard}>
          <Pressable style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>Lukk</Text>
          </Pressable>

          <Text style={styles.calendarModalTitle}>
            Kalender & Arrangementer
          </Text>

          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            markingType="dot"
            theme={{
              todayTextColor: "#57507F",
              selectedDayBackgroundColor: "#BCA9FF",
              dotColor: "#57507F",
              textDayHeaderFontWeight: "600",
              monthTextColor: "#57507F",
              textMonthFontWeight: "700",
            }}
            style={styles.calendarStyle}
          />

          <View style={styles.eventsContainer}>
            <Text style={styles.eventsHeader}>
              Arrangementer:{" "}
              {selectedDate ? formatDateShort(selectedDate) : "Velg dato"}
            </Text>
            <ScrollView style={styles.eventsList}>
              {eventsForSelectedDate.length > 0 ? (
                eventsForSelectedDate.map(renderEvent)
              ) : (
                <Text style={styles.noEventsText}>
                  {selectedDate
                    ? "Ingen arrangementer denne dagen."
                    : "Velg en dag i kalenderen for å se arrangementer."}
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
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  overlayCard: {
    width: "100%",
    maxHeight: "75%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    flex: 1,   
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
  calendarModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  calendarStyle: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    marginBottom: 16,
  },
  eventsContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#eee",
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
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#57507F",
  },
  eventTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#333",
  },
  eventSubtitle: {
    fontSize: 13,
    color: "#57507F",
    marginTop: 4,
  },
  eventDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
  },
  noEventsText: {
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});
