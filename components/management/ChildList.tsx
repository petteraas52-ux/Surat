/**
 * CHILD LIST COMPONENT
 * * ROLE:
 * A management interface for staff to view, filter, edit, and delete
 * child records from the system.
 * * KEY LOGIC:
 * 1. Search Debouncing: Implements a 500ms delay between typing and
 * filtering to prevent UI stutter during heavy list processing.
 * 2. CRUD Operations: Interfaces directly with 'childrenApi' for
 * real-time database deletion and re-fetching.
 * 3. Responsive Filtering: Filters by both name and department
 * simultaneously for better usability in large schools.
 */

import { deleteChild, getAllChildren } from "@/api/childrenApi";
import { styles } from "@/components/modals/commonStyles";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { ChildProps } from "@/types/childData";
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

interface ChildListProps {
  onEdit: (child: ChildProps) => void;
}

export function ChildList({ onEdit }: ChildListProps) {
  // --- STATE ---
  const [children, setChildren] = useState<ChildProps[]>([]);
  const [displayQuery, setDisplayQuery] = useState(""); // Immediate UI state
  const [searchQuery, setSearchQuery] = useState(""); // Debounced search value
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { t } = useI18n();
  const theme = useAppTheme();

  // --- INITIAL FETCH ---
  useEffect(() => {
    fetchChildren();
  }, []);

  /**
   * DEBOUNCE EFFECT
   * Updates 'searchQuery' only after the user has stopped typing for 500ms.
   * This optimizes performance by reducing the frequency of list re-renders.
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

  const fetchChildren = async () => {
    try {
      const data = await getAllChildren();
      setChildren(data);
    } catch (err) {
      Alert.alert(t("errorTitle"), t("failedToLoadChildren"));
    } finally {
      setLoading(false);
    }
  };

  /**
   * DELETE HANDLER
   * Triggers a native alert confirmation before invoking the API.
   */
  const handleDelete = (id: string) => {
    Alert.alert(t("confirmDelete"), t("deleteWarning"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteChild(id);
            fetchChildren(); // Refresh the list after deletion
          } catch (err) {
            Alert.alert(t("errorTitle"), t("deleteFailed"));
          }
        },
      },
    ]);
  };

  // --- FILTER LOGIC ---
  const filtered = children.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase())
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
          placeholder={t("searchChildPlaceholder") || "Search child..."}
          value={displayQuery}
          onChangeText={setDisplayQuery}
          placeholderTextColor={theme.placeholder}
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

      {/* LIST OF CHILDREN */}
      {filtered.map((child) => (
        <View
          key={child.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
          }}
        >
          {/* CHILD INFO */}
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text
              style={{ color: theme.text, fontSize: 16, fontWeight: "600" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {child.firstName} {child.lastName}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
              {child.department} • {child.dateOfBirth}
            </Text>
          </View>

          {/* ACTIONS */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => onEdit(child)}
              style={{ padding: 8 }}
            >
              <Ionicons name="pencil-outline" size={22} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(child.id)}
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
