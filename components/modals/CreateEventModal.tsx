import { getAllDepartments } from "@/api/department";
import { createEvent } from "@/api/event";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { DepartmentProps } from "@/types/department";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
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

  const deptItems = departments.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));

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
      console.error(err);
      Alert.alert(t("errorTitle"), t("eventCreationFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (loadingDepts) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("createEventTitle")}</Text>

      <Text style={styles.label}>{t("title")}:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={t("writeTitle")}
      />

      <Text style={styles.label}>{t("department")}:</Text>
      <View style={{ zIndex: 2000 }}>
        <DropDownPicker
          open={open}
          value={selectedDepartment}
          items={deptItems}
          setOpen={setOpen}
          setValue={setSelectedDepartment}
          placeholder={t("selectDepartment") || t("writeDepartment")}
          searchable={true}
          searchPlaceholder={t("searchDepartmentPlaceholer")}
          listMode="SCROLLVIEW"
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              height: 50,
              paddingHorizontal: 10,
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

      <Text style={styles.label}>{t("description")}:</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        placeholder={t("writeDescription")}
        multiline
      />

      <Text style={styles.label}>{t("date")}:</Text>
      <Pressable
        style={[
          styles.datePickerButton,
          { backgroundColor: theme.inputBackground },
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={{ color: theme.text }}>{date.toDateString()}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Pressable
        style={[
          styles.createButton,
          {
            backgroundColor: loading ? theme.primary + "50" : theme.primary,
            marginTop: 20,
          },
        ]}
        onPress={handleCreateEvent}
        disabled={loading}
      >
        <Text style={styles.createButtonText}>
          {loading ? t("saving") : t("createEvent")}
        </Text>
      </Pressable>
    </View>
  );
}
