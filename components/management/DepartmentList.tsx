/**
 * DEPARTMENT LIST COMPONENT
 * * ROLE:
 * Provides a management interface for staff to view, filter, edit, and
 * delete school departments (e.g., "Preschool", "Toddler Room").
 * * KEY LOGIC:
 * 1. Debounced Search: Separates the immediate input state from the
 * expensive filter operation to ensure smooth typing.
 * 2. CRUD Operations: Synchronizes with the 'departmentApi' to maintain
 * an up-to-date list of available school areas.
 * 3. Dynamic Styles: Maps theme colors to borders, inputs, and text.
 */

import { deleteDepartment, getAllDepartments } from "@/api/departmentApi";
import { styles } from "@/components/modals/commonStyles";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { DepartmentProps } from "@/types/departmentData";
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

export function DepartmentList({
  onEdit,
}: {
  onEdit: (d: DepartmentProps) => void;
}) {
  // --- STATE ---
  const [departments, setDepartments] = useState<DepartmentProps[]>([]);
  const [displayQuery, setDisplayQuery] = useState(""); // Immediate UI typing
  const [searchQuery, setSearchQuery] = useState(""); // Delayed value for filtering
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { t } = useI18n();
  const theme = useAppTheme();

  // --- INITIALIZATION ---
  useEffect(() => {
    loadDepts();
  }, []);

  /**
   * SEARCH DEBOUNCE EFFECT
   * Waits for the user to stop typing for 500ms before triggering the filter logic.
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

  /**
   * FETCH DATA
   * Pulls department documents from Firestore.
   */
  const loadDepts = async () => {
    try {
      const data = await getAllDepartments();
      setDepartments(data);
    } catch (err) {
      Alert.alert(t("errorTitle"), t("failedToLoadDepartments"));
    } finally {
      setLoading(false);
    }
  };

  /**
   * DELETE HANDLER
   * Confirms intention before removing a department from the database.
   */
  const handleDelete = (id: string) => {
    Alert.alert(t("confirmDelete"), t("deleteWarning"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDepartment(id);
            loadDepts(); // Refresh the list
          } catch (error) {
            Alert.alert(t("errorTitle"), t("deleteFailed"));
          }
        },
      },
    ]);
  };

  // --- FILTERING ---
  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          placeholder={
            t("searchDepartmentPlaceholder") || "Search department..."
          }
          placeholderTextColor={theme.placeholder}
          value={displayQuery}
          onChangeText={setDisplayQuery}
          style={{
            flex: 1,
            color: theme.text,
            height: "100%",
          }}
        />
        {/* INDICATOR LOGIC */}
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

      {/* RENDERED LIST */}
      {filtered.map((item) => (
        <View
          key={item.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
          }}
        >
          {/* DEPARTMENT NAME */}
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text
              style={{ color: theme.text, fontSize: 16, fontWeight: "600" }}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </View>

          {/* ACTION BUTTONS */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => onEdit(item)}
              style={{ padding: 8 }}
            >
              <Ionicons name="pencil-outline" size={22} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
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
