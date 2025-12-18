/**
 * EMPLOYEE LIST COMPONENT
 * * ROLE:
 * Allows administrative users to manage staff records. This includes
 * searching, filtering by name or department, and providing entry points
 * for editing or deleting employees.
 * * KEY LOGIC:
 * 1. Debounced Search: Updates the search query 500ms after the user stops
 * typing to ensure the filter operation doesn't block the UI thread.
 * 2. CRUD Integration: Connects to 'employeApi' for data fetching and removal.
 * 3. Dynamic Filtering: Searches through both employee full names and
 * their assigned departments.
 */

import { deleteEmployee, getAllEmployees } from "@/api/employeApi";
import { styles } from "@/components/modals/commonStyles";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { EmployeeProps } from "@/types/employeeData";
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

interface EmployeeListProps {
  onEdit: (employee: EmployeeProps) => void;
}

export function EmployeeList({ onEdit }: EmployeeListProps) {
  // --- STATE ---
  const [employees, setEmployees] = useState<EmployeeProps[]>([]);
  const [displayQuery, setDisplayQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { t } = useI18n();
  const theme = useAppTheme();

  // --- INITIAL LOAD ---
  useEffect(() => {
    fetchEmployees();
  }, []);

  /**
   * DEBOUNCE EFFECT
   * Synchronizes the internal 'searchQuery' with the 'displayQuery'
   * after a short delay to optimize list filtering performance.
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

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (err) {
      Alert.alert(t("errorTitle"), t("failedToLoadEmployees"));
    } finally {
      setLoading(false);
    }
  };

  /**
   * DELETE HANDLER
   * Confirms staff removal via native Alert and refreshes data on success.
   */
  const handleDelete = (id: string) => {
    Alert.alert(t("confirmDelete"), t("deleteWarning"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteEmployee(id);
            fetchEmployees();
          } catch (err) {
            Alert.alert(t("errorTitle"), t("deleteFailed"));
          }
        },
      },
    ]);
  };

  // --- FILTERING LOGIC ---
  const filtered = employees.filter(
    (e) =>
      `${e.firstName} ${e.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
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
      {/* SEARCH INPUT AREA */}
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
          placeholder={t("searchEmployeePlaceholder") || "Search employee..."}
          placeholderTextColor={theme.placeholder}
          value={displayQuery}
          onChangeText={setDisplayQuery}
          style={{
            flex: 1,
            color: theme.text,
            height: "100%",
          }}
        />
        {/* DEBOUNCE & CLEAR INDICATOR */}
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

      {/* RENDERED EMPLOYEE ROWS */}
      {filtered.map((emp) => (
        <View
          key={emp.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
          }}
        >
          {/* EMPLOYEE INFO CONTAINER */}
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text
              style={{ color: theme.text, fontSize: 16, fontWeight: "600" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {emp.firstName} {emp.lastName}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
              {emp.department} • {emp.phone}
            </Text>
          </View>

          {/* ACTION BUTTONS (EDIT & DELETE) */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => onEdit(emp)}
              style={{ padding: 8 }}
            >
              <Ionicons name="pencil-outline" size={22} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(emp.id)}
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
