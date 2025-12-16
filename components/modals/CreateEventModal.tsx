// modules/CreateEventModule.tsx

import { createEvent } from "@/api/event";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./commonStyles"; // Import common styles
import { useI18n } from "@/hooks/useI18n";
import { useAppTheme } from "@/hooks/useAppTheme";


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
      Alert.alert(t("errorTitle") || "Error", t("fillAllFields") || "Fyll ut alle feltene.");
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
      Alert.alert(t("successTitle") || "Suksess", t("eventCreated") || "Hendelse opprettet!");
      // reset form
      setTitle("");
      setDepartment("");
      setDescription("");
      setDate(new Date());
    } catch (err) {
      console.error(err);
      Alert.alert(t("errorTitle") || "Error", t("eventCreationFailed") || "Kunne ikke opprette hendelse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("createEventTitle") || "Create Event"}</Text>

      <Text style={styles.label}>{t("title") || "Tittel"}:</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder={t("writeTitle") || "Skriv tittel"} />

      <Text style={styles.label}>{t("department") || "Avdeling"}:</Text>
      <TextInput style={styles.input} value={department} onChangeText={setDepartment} placeholder={t("writeDepartment") || "Skriv avdeling"} />

      <Text style={styles.label}>{t("description") || "Beskrivelse"}:</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        placeholder={t("writeDescription") || "Skriv beskrivelse"}
        multiline
      />

      <Text style={styles.label}>{t("date") || "Dato"}:</Text>
      <Pressable
        style={[styles.datePickerButton, {backgroundColor: theme.inputBackground}]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={{color: theme.text}}>{date.toDateString()}</Text>
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
          {loading ? t("saving") || "Lagrer..." : t("createEvent") || "Opprett hendelse"}
        </Text>
      </Pressable>
    </View>
  );
}