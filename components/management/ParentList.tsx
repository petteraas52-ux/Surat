/**
 * PARENT LIST COMPONENT
 * * ROLE:
 * Provides an administrative view for managing parent accounts within the system.
 * Supports real-time search, editing, and deletion of parent records.
 * * KEY LOGIC:
 * 1. Debounced Search: Synchronizes 'displayQuery' with 'searchQuery' after 500ms
 * to ensure that filtering a potentially large list of users doesn't block the UI.
 * 2. Multi-Field Filter: Allows staff to find parents by either their full name
 * or their email address.
 * 3. State Synchronization: Automatically re-fetches the list from 'parentApi'
 * after a successful deletion to ensure data consistency.
 */

import { deleteParent, getAllParents } from "@/api/parentApi";
import { styles } from "@/components/modals/commonStyles";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { ParentProps } from "@/types/parentData";
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

interface ParentListProps {
  onEdit: (parent: ParentProps) => void;
}

export function ParentList({ onEdit }: ParentListProps) {
  // --- STATE ---
  const [parents, setParents] = useState<ParentProps[]>([]);
  const [displayQuery, setDisplayQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { t } = useI18n();
  const theme = useAppTheme();

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    fetchParents();
  }, []);

  /**
   * DEBOUNCE EFFECT
   * Prevents excessive re-filtering while the user is actively typing.
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

  const fetchParents = async () => {
    try {
      const data = await getAllParents();
      setParents(data);
    } catch (err) {
      Alert.alert(t("errorTitle"), t("failedToLoadParents"));
    } finally {
      setLoading(false);
    }
  };

  /**
   * DELETE HANDLER
   * Confirms deletion via native Alert and executes API call.
   */
  const handleDelete = (id: string) => {
    Alert.alert(t("confirmDelete"), t("deleteWarning"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteParent(id);
            fetchParents(); // Refresh list on success
          } catch (err) {
            Alert.alert(t("errorTitle"), t("deleteFailed"));
          }
        },
      },
    ]);
  };

  // --- SEARCH FILTERING ---
  const filtered = parents.filter(
    (p) =>
      `${p.firstName} ${p.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      p.eMail.toLowerCase().includes(searchQuery.toLowerCase())
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
      {/* SEARCH BAR SECTION */}
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
          placeholder={t("searchParentPlaceholder") || "Search parent..."}
          placeholderTextColor={theme.placeholder}
          value={displayQuery}
          onChangeText={setDisplayQuery}
          style={{
            flex: 1,
            color: theme.text,
            height: "100%",
          }}
        />
        {/* FEEDBACK ICON (SPINNER OR CLEAR) */}
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

      {/* PARENT LIST ITEMS */}
      {filtered.map((parent) => (
        <View
          key={parent.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
          }}
        >
          {/* USER INFORMATION */}
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text
              style={{ color: theme.text, fontSize: 16, fontWeight: "600" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {parent.firstName} {parent.lastName}
            </Text>
            <Text
              style={{ color: theme.textSecondary, fontSize: 13 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {parent.eMail}
            </Text>
          </View>

          {/* ACTION BUTTONS */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => onEdit(parent)}
              style={{ padding: 8 }}
            >
              <Ionicons name="pencil-outline" size={22} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(parent.id)}
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
