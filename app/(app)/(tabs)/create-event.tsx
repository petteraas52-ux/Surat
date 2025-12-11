import { createEvent } from "@/api/event";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateEventScreen() {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateEvent = async () => {
    if (!title || !department || !description) {
      Alert.alert("Error", "Fyll ut alle feltene.");
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
      Alert.alert("Suksess", "Hendelse opprettet!");
      // reset form
      setTitle("");
      setDepartment("");
      setDescription("");
      setDate(new Date());
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Kunne ikke opprette hendelse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.label}>Tittel:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Skriv tittel"
        />

        <Text style={styles.label}>Avdeling:</Text>
        <TextInput
          style={styles.input}
          value={department}
          onChangeText={setDepartment}
          placeholder="Skriv avdeling"
        />

        <Text style={styles.label}>Beskrivelse:</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Skriv beskrivelse"
          multiline
        />

        <Text style={styles.label}>Dato:</Text>
        <Pressable
          style={styles.datePickerButton}
          onPress={() => setShowPicker(true)}
        >
          <Text>{date.toDateString()}</Text>
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
          style={styles.createButton}
          onPress={handleCreateEvent}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? "Lagrer..." : "Opprett hendelse"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 24 },
  label: { fontWeight: "700", marginTop: 16, marginBottom: 6 },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  datePickerButton: {
    backgroundColor: "#eaeaea",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  createButton: {
    backgroundColor: "#57507F",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 24,
  },
  createButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
