/**
 * CREATE EVENT MODAL
 * * ROLE:
 * Allows staff to publish events to specific departments. These events
 * automatically populate the 'CalendarModal' viewed by parents.
 * * KEY LOGIC:
 * 1. Timestamp Conversion: Converts JavaScript Date objects into Firebase
 * 'Timestamp' objects before storage to maintain global consistency.
 * 2. Cross-Platform Date Picking: Implements a Modal-wrapped spinner for iOS
 * and a native system dialog for Android to provide the best native feel.
 * 3. Z-Index Management: Carefully manages zIndex for the DropDownPicker to
 * ensure the department list overlays the date picker button correctly.
 */

import { getAllDepartments } from "@/api/departmentApi";
import { createEvent } from "@/api/eventApi";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { DepartmentProps } from "@/types/departmentData";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { styles } from "./commonStyles";

export function CreateEventModal() {
  const { t } = useI18n();
  const theme = useAppTheme();

  // --- FORM STATE ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- DROPDOWN STATE ---
  const [departments, setDepartments] = useState<DepartmentProps[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getAllDepartments();
        setDepartments(data);
      } catch (err) {
        console.error("Error loading departments:", err);
      } finally {
        setLoadingDepts(false);
      }
    };
    fetchDepartments();
  }, []);

  /**
   * SUBMIT HANDLER
   * Validates input and transforms data for Firestore.
   */
  const handleCreateEvent = async () => {
    if (!title.trim() || !selectedDepartment || !description.trim()) {
      Alert.alert(t("errorTitle"), t("fillAllFields"));
      return;
    }

    setLoading(true);
    try {
      await createEvent({
        title: title.trim(),
        department: selectedDepartment,
        description: description.trim(),
        date: Timestamp.fromDate(date), // Critical for Firestore querying
      });

      Alert.alert(t("successTitle"), t("eventCreated"));

      // Reset State
      setTitle("");
      setSelectedDepartment(null);
      setDescription("");
      setDate(new Date());
    } catch (err) {
      Alert.alert(t("errorTitle"), t("eventCreationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false); // Android picker closes on selection
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        {t("createEventTitle")}
      </Text>

      {/* TITLE INPUT */}
      <Text style={[styles.label, { color: theme.text }]}>{t("title")}</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
          },
        ]}
        value={title}
        onChangeText={setTitle}
        placeholder={t("writeTitle")}
        placeholderTextColor={theme.textMuted}
      />

      {/* DEPARTMENT DROPDOWN */}
      <Text style={[styles.label, { color: theme.text }]}>
        {t("department")}
      </Text>
      <View style={{ zIndex: 3000 }}>
        <DropDownPicker
          open={open}
          value={selectedDepartment}
          items={departments.map((d) => ({ label: d.name, value: d.name }))}
          setOpen={setOpen}
          setValue={setSelectedDepartment}
          placeholder={t("selectDepartment")}
          searchable={true}
          listMode="SCROLLVIEW"
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
          textStyle={{ color: theme.text }}
          dropDownContainerStyle={{
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
          }}
          containerStyle={{ marginBottom: open ? 160 : 15 }}
        />
      </View>

      {/* DATE PICKER BUTTON */}
      <Text style={[styles.label, { color: theme.text }]}>{t("date")}</Text>
      <Pressable
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={{ color: theme.text, fontSize: 16 }}>
          {date.toLocaleDateString(undefined, {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={theme.primary} />
      </Pressable>

      {/* DESCRIPTION INPUT */}
      <Text style={[styles.label, { color: theme.text }]}>
        {t("description")}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            height: 120,
            color: theme.text,
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            textAlignVertical: "top",
            paddingTop: 12,
          },
        ]}
        value={description}
        onChangeText={setDescription}
        placeholder={t("writeDescription")}
        placeholderTextColor={theme.textMuted}
        multiline
      />

      {/* NATIVE DATE PICKER LOGIC */}
      {showPicker &&
        (Platform.OS === "ios" ? (
          <Modal transparent animationType="slide" visible={showPicker}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{
                  backgroundColor: theme.background,
                  padding: 20,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 15,
                  }}
                >
                  <Text
                    style={{
                      color: theme.text,
                      fontWeight: "700",
                      fontSize: 18,
                    }}
                  >
                    {t("selectDate")}
                  </Text>
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text
                      style={{
                        color: theme.primary,
                        fontWeight: "700",
                        fontSize: 16,
                      }}
                    >
                      {t("done")}
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  textColor={theme.text}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        ))}

      {/* SUBMIT BUTTON */}
      <Pressable
        style={[
          styles.createButton,
          {
            backgroundColor: loading ? theme.primary + "80" : theme.primary,
            marginTop: 40,
          },
        ]}
        onPress={handleCreateEvent}
        disabled={loading}
      >
        <Text style={styles.createButtonText}>
          {loading ? t("saving") : t("createEvent")}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
