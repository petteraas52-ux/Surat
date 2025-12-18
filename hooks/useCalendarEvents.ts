/**
 * USE CALENDAR EVENTS HOOK
 * * ROLE:
 * A logic controller that transforms raw event data into UI-ready states
 * for the calendar and dashboard components.
 * * CORE FUNCTIONALITY:
 * 1. Marked Dates Mapping: Converts event arrays into a keyed object
 * structure compatible with 'react-native-calendars'.
 * 2. Smart Filtering: Dynamically extracts events for a specific clicked day.
 * 3. Priority Sorting: Calculates the "Next Event" by filtering out past
 * occurrences and finding the earliest future date.
 * 4. Navigation & State: Manages modal visibility and auto-focusing on
 * relevant dates when opening the calendar.
 */

import { EventProps } from "@/types/eventData";
import { parseISODateToLocal, parseTimestampToDateString } from "@/utils/date";
import { useMemo, useState } from "react";
import { DateData } from "react-native-calendars";

interface UseCalendarEventsProps {
  events: EventProps[];
}

// Internal type for processing dates and sorting
type EventWithTime = EventProps & { time: Date };

export const useCalendarEvents = ({ events }: UseCalendarEventsProps) => {
  // --- STATE ---
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [selectedDateInCalendar, setSelectedDateInCalendar] = useState<
    string | null
  >(null);

  /**
   * markedDates
   * Creates the 'markedDates' object for the Calendar component.
   * Maps 'YYYY-MM-DD' keys to styling metadata (dots and selection highlights).
   */
  const markedDates = useMemo(() => {
    const m: Record<string, any> = {};
    const counts: Record<string, number> = {};

    // First pass: Aggregate event counts per date
    events.forEach((ev) => {
      const dateStr = parseTimestampToDateString(ev.date);
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    // Second pass: Define visual dot markers
    events.forEach((ev) => {
      const dateStr = parseTimestampToDateString(ev.date);
      m[dateStr] = {
        marked: true,
        dotColor: "#57507F",
        eventCount: counts[dateStr],
      };
    });

    // Third pass: Apply selection styling to the active day
    if (selectedDateInCalendar) {
      m[selectedDateInCalendar] = {
        ...(m[selectedDateInCalendar] || {}),
        selected: true,
        selectedColor: "#BCA9FF",
      };
    }

    return m;
  }, [events, selectedDateInCalendar]);

  /**
   * nextEvent
   * Identifies the single most relevant upcoming event.
   * Logic: Filters for today/future dates, sorts ascending, and takes the first item.
   */
  const nextEvent = useMemo(() => {
    if (!events.length) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalized to midnight

    const future: EventWithTime[] = events
      .map((ev) => ({
        ...ev,
        time: parseISODateToLocal(parseTimestampToDateString(ev.date)),
      }))
      .filter((ev) => ev.time.getTime() >= today.getTime())
      .sort((a, b) => a.time.getTime() - b.time.getTime());

    return future.length ? future[0] : null;
  }, [events]);

  /**
   * eventsForSelectedDate
   * Filters the main event list to find items matching the currently
   * selected calendar date. Powers the list below the calendar.
   */
  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDateInCalendar) return [];
    return events.filter(
      (ev) => parseTimestampToDateString(ev.date) === selectedDateInCalendar
    );
  }, [events, selectedDateInCalendar]);

  // --- HANDLERS ---

  /**
   * onCalendarDayPress
   * Triggered when a user clicks a day in the calendar grid.
   */
  const onCalendarDayPress = (day: DateData) =>
    setSelectedDateInCalendar(day.dateString);

  /**
   * openCalendarModal
   * Opens the calendar and defaults the view to the next upcoming event.
   */
  const openCalendarModal = () => {
    setCalendarModalVisible(true);
    if (nextEvent) {
      setSelectedDateInCalendar(parseTimestampToDateString(nextEvent.date));
    }
  };

  /**
   * openCalendarModalForDate
   * Opens the calendar focused on a specific date (used for external links).
   */
  const openCalendarModalForDate = (dateStr: string) => {
    setSelectedDateInCalendar(dateStr);
    setCalendarModalVisible(true);
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
    openCalendarModalForDate,
  };
};
