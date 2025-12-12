import { EventProps } from "@/types/event";
import { parseISODateToLocal, parseTimestampToDateString } from "@/utils/date";
import { useMemo, useState } from "react";
import { DateData } from "react-native-calendars";

interface UseCalendarEventsProps {
  events: EventProps[];
}

type EventWithTime = EventProps & { time: Date };

export const useCalendarEvents = ({ events }: UseCalendarEventsProps) => {
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [selectedDateInCalendar, setSelectedDateInCalendar] = useState<
    string | null
  >(null);

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

    const future: EventWithTime[] = events
      .map((ev) => ({
        ...ev,
        time: parseISODateToLocal(parseTimestampToDateString(ev.date)),
      }))
      .filter((ev) => ev.time.getTime() >= today.getTime())
      .sort((a, b) => a.time.getTime() - b.time.getTime());

    return future.length ? future[0] : null;
  }, [events]);

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDateInCalendar) return [];
    return events.filter(
      (ev) => parseTimestampToDateString(ev.date) === selectedDateInCalendar
    );
  }, [events, selectedDateInCalendar]);

  const onCalendarDayPress = (day: DateData) =>
    setSelectedDateInCalendar(day.dateString);

  const openCalendarModal = () => {
    setCalendarModalVisible(true);
    if (nextEvent) {
      setSelectedDateInCalendar(parseTimestampToDateString(nextEvent.date));
    }
  };

  const closeCalendarModal = () => {
    setCalendarModalVisible(false);
  };

  return {
    calendarModalVisible,
    selectedDateInCalendar,
    markedDates,
    nextEvent,
    eventsForSelectedDate,
    onCalendarDayPress,
    openCalendarModal,
    closeCalendarModal,
  };
};
