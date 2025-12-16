import { createEvent } from "@/api/event";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./commonStyles";

export function CreateEventModal() {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();
  const theme = useAppTheme();

  const handleCreateEvent = async () => {
    if (!title || !department || !description) {
      Alert.alert(t("errorTitle"), t("fillAllFields"));
      return;
    }

    setLoading(true);
    try {
      await createEvent({
        title,
        department,
        description,
        date: Timestamp.fromDate(date),
      });
      Alert.alert(t("successTitle"), t("eventCreated"));

      setTitle("");
      setDepartment("");
      setDescription("");
      setDate(new Date());
    } catch (err) {
      console.error(err);
      Alert.alert(t("errorTitle"), t("eventCreationFailed"));
    } finally {
      setLoading(false);
    }
  };

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
      <TextInput
        style={styles.input}
        value={department}
        onChangeText={setDepartment}
        placeholder={t("writeDepartment")}
      />

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
          { backgroundColor: loading ? theme.primary + "50" : theme.primary },
        ]}
        onPress={handleCreateEvent}
        disabled={loading}
      >
        <Text style={styles.createButtonText}>
          {loading ? t("saving") : t("createEvent") || "Opprett hendelse"}
        </Text>
      </Pressable>
    </View>
  );
}
