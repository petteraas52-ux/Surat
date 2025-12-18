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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<DepartmentProps[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

  const { t } = useI18n();
  const theme = useAppTheme();

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

  const handleCreateEvent = async () => {
    if (!title || !selectedDepartment || !description) {
      Alert.alert(t("errorTitle"), t("fillAllFields"));
      return;
    }
    setLoading(true);
    try {
      await createEvent({
        title,
        department: selectedDepartment,
        description,
        date: Timestamp.fromDate(date),
      });
      Alert.alert(t("successTitle"), t("eventCreated"));
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
      setShowPicker(false);
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
    >
      <Text style={[styles.title, {color: theme.text}]}>{t("createEventTitle")}</Text>

      <Text style={[styles.label, { color: theme.text }]}>{t("title")}</Text>
      <TextInput
        style={[
          styles.input,
          { color: theme.text, backgroundColor: theme.inputBackground },
        ]}
        value={title}
        onChangeText={setTitle}
        placeholder={t("writeTitle")}
        placeholderTextColor={theme.textSecondary}
      />

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

      <Text style={[styles.label, { color: theme.text }]}>{t("date")}</Text>
      <Pressable
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 15,
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

      <Text style={[styles.label, { color: theme.text }]}>
        {t("description")}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            height: 100,
            color: theme.text,
            backgroundColor: theme.inputBackground,
            textAlignVertical: "top",
            paddingTop: 10,
          },
        ]}
        value={description}
        onChangeText={setDescription}
        placeholder={t("writeDescription")}
        placeholderTextColor={theme.textSecondary}
        multiline
      />

      {/* CLEAN DATE PICKER MODAL */}
      {showPicker &&
        (Platform.OS === "ios" ? (
          <Modal transparent animationType="fade" visible={showPicker}>
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
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: theme.text, fontWeight: "bold" }}>
                    {t("selectDate")}
                  </Text>
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text style={{ color: theme.primary, fontWeight: "bold" }}>
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

      <Pressable
        style={[
          styles.createButton,
          {
            backgroundColor: loading ? theme.primary + "50" : theme.primary,
            marginTop: 30,
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
