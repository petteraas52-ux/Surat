import { deleteEvent, getAllEvents } from "@/api/event";
import { styles } from "@/components/modals/commonStyles";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { EventProps } from "@/types/event";
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
  const [events, setEvents] = useState<EventProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();
  const theme = useAppTheme();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
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

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color={theme.primary}
        style={{ marginTop: 20 }}
      />
    );

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <TextInput
        placeholder={t("searchEventPlaceholder") || "Search event..."}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            color: theme.text,
            marginBottom: 10,
          },
        ]}
      />
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
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text
              style={{ color: theme.text, fontSize: 16, fontWeight: "600" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {event.title}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
              {event.date?.toDate().toLocaleDateString()} • {event.department}
            </Text>
          </View>

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
                      await deleteEvent(event.id);
                      fetchEvents();
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
