import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { createChild } from "@/api/children";
import { addChildToParent, getAllParents } from "@/api/parents";
import { ParentProps } from "@/types/parent";

export default function CreateChildScreen() {
  const [parents, setParents] = useState<ParentProps[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [department, setDepartment] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingParents, setLoadingParents] = useState(true);

  // Load all parents for dropdown
  useEffect(() => {
    const loadParents = async () => {
      try {
        const data = await getAllParents();
        setParents(data);
        if (data.length > 0) setSelectedParent(data[0].id);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to load parents");
      } finally {
        setLoadingParents(false);
      }
    };

    loadParents();
  }, []);

  const handleCreateChild = async () => {
    if (!firstName || !lastName || !selectedParent) {
      Alert.alert("Missing fields", "Please complete all required fields.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create child
      const childUid = await createChild({
        firstName,
        lastName,
        dateOfBirth,
        allergies: [],
        imageUri: "",
        parents: [selectedParent], // link to parent
        checkedIn: false,
        department,
      });

      // 2️⃣ Update parent to include this child
      await addChildToParent(selectedParent, childUid);

      Alert.alert("Success", "Child created successfully");

      // Reset form
      setFirstName("");
      setLastName("");
      setDateOfBirth("");
      setDepartment("");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to create child");
    } finally {
      setLoading(false);
    }
  };

  if (loadingParents) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Child</Text>

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <TextInput
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        style={styles.input}
      />

      <TextInput
        placeholder="Department"
        value={department}
        onChangeText={setDepartment}
        style={styles.input}
      />

      <Text style={styles.label}>Assign Parent</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedParent}
          onValueChange={(value) => setSelectedParent(value)}
        >
          {parents.map((parent) => (
            <Picker.Item
              key={parent.id}
              label={`${parent.firstName} ${parent.lastName}`}
              value={parent.id}
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        onPress={handleCreateChild}
        disabled={loading}
        style={[
          styles.button,
          { backgroundColor: loading ? "#ccc" : "#2563eb" },
        ]}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Child"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 25 },
  label: { fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
