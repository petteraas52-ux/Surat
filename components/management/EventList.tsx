/**
 * EVENT LIST COMPONENT
 * * ROLE:
 * Allows staff to manage the school calendar. This includes searching for
 * specific events, filtering by department, and editing or removing entries.
 * * KEY LOGIC:
 * 1. Timestamp Sorting: Automatically sorts events by date (newest first) using
 * Firebase's 'seconds' property to ensure the timeline remains logical.
 * 2. Debounced Search: Optimizes the UI by delaying the filter operation
 * until the user pauses typing.
 * 3. Date Formatting: Converts Firestore Timestamps into human-readable strings
 * using 'toLocaleDateString()'.
 */

import { deleteEvent, getAllEvents } from "@/api/eventApi";
import { styles } from "@/components/modals/commonStyles";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { EventProps } from "@/types/eventData";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EventListProps {
  onEdit: (event: EventProps) => void;
}

export function EventList({ onEdit }: EventListProps) {
  // --- STATE ---
  const [events, setEvents] = useState<EventProps[]>([]);
  const [displayQuery, setDisplayQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { t } = useI18n();
  const theme = useAppTheme();

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    fetchEvents();
  }, []);

  /**
   * SEARCH DEBOUNCE
   * Triggers a UI spinner and delays filtering by 500ms to maintain
   * 60fps performance during rapid text input.
   */
  useEffect(() => {
    if (displayQuery !== searchQuery) {
      setIsDebouncing(true);
    }
    const handler = setTimeout(() => {
      setSearchQuery(displayQuery);
      setIsDebouncing(false);
    }, 500);
    return () => clearTimeout(handler);
  }, [displayQuery]);

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();

      /**
       * CHRONOLOGICAL SORTING
       * Firebase Timestamps contain a 'seconds' field. We use this to sort
       * the array so that the most recent or future events appear at the top.
       */
      const sorted = data.sort(
        (a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0)
      );
      setEvents(sorted);
    } catch (err) {
      Alert.alert(t("errorTitle"), t("failedToLoadEvents"));
    } finally {
      setLoading(false);
    }
  };

  // --- FILTER LOGIC ---
  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={theme.primary}
        style={{ marginTop: 20 }}
      />
    );
  }

  return (
    <View style={{ paddingHorizontal: 20 }}>
      {/* SEARCH BAR */}
      <View
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            flexDirection: "row",
            alignItems: "center",
            paddingRight: 15,
            marginBottom: 10,
          },
        ]}
      >
        <TextInput
          placeholder={t("searchEventPlaceholder") || "Search event..."}
          placeholderTextColor={theme.placeholder}
          value={displayQuery}
          onChangeText={setDisplayQuery}
          style={{
            flex: 1,
            color: theme.text,
            height: "100%",
          }}
        />
        {isDebouncing ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : displayQuery.length > 0 ? (
          <TouchableOpacity onPress={() => setDisplayQuery("")}>
            <Ionicons
              name="close-circle"
              size={18}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* EVENT ITEMS */}
      {filtered.map((event) => (
        <View
          key={event.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
          }}
        >
          {/* INFO SECTION */}
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text
              style={{ color: theme.text, fontSize: 16, fontWeight: "600" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {event.title}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
              {/* Convert Firestore Timestamp to readable string */}
              {event.date?.toDate().toLocaleDateString()} • {event.department}
            </Text>
          </View>

          {/* ACTION BUTTONS */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => onEdit(event)}
              style={{ padding: 8 }}
            >
              <Ionicons name="pencil-outline" size={22} color={theme.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Alert.alert(t("confirmDelete"), t("deleteWarning"), [
                  { text: t("cancel"), style: "cancel" },
                  {
                    text: t("delete"),
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await deleteEvent(event.id);
                        fetchEvents();
                      } catch (error) {
                        Alert.alert(t("errorTitle"), t("deleteFailed"));
                      }
                    },
                  },
                ]);
              }}
              style={{ padding: 8 }}
            >
              <Ionicons name="trash-outline" size={22} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}
