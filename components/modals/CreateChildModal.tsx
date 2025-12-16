// modules/CreateChildModule.tsx

import { createChild } from "@/api/children";
import { addChildToParent, getAllParents } from "@/api/parents";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { ParentProps } from "@/types/parent";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./commonStyles";

export function CreateChildModal() {
  const [parents, setParents] = useState<ParentProps[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [department, setDepartment] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingParents, setLoadingParents] = useState(true);
  const { t } = useI18n();
  const theme = useAppTheme();

  useEffect(() => {
    const loadParents = async () => {
      try {
        const data = await getAllParents();
        setParents(data);
        if (data.length > 0) setSelectedParent(data[0].id);
      } catch (err) {
        console.error("Error loading parents:", err);
        Alert.alert(
          t("errorTitle") || "Error",
          t("failedToLoadParents") || "Failed to load parents"
        );
      } finally {
        setLoadingParents(false);
      }
    };

    loadParents();
  }, []);

  const handleCreateChild = async () => {
    if (!firstName || !lastName || !selectedParent) {
      Alert.alert(
        t("missingFieldsTitle") || "Missing fields",
        t("completeRequiredFields") || "Please complete all required fields."
      );
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting to create child for parent ID:", selectedParent);

      const childUid = await createChild({
        firstName,
        lastName,
        dateOfBirth,
        allergies: [],
        imageUri: "",
        parents: [selectedParent],
        checkedIn: false,
        department,
      });

      if (!childUid) {
        throw new Error("Child creation failed to return a UID.");
      }

      await addChildToParent(selectedParent, childUid);

      Alert.alert(
        t("successTitle") || "Success",
        t("childCreatedMessage") || "Child created successfully"
      );

      setFirstName("");
      setLastName("");
      setDateOfBirth("");
      setDepartment("");
    } catch (err: any) {
      console.error("Error during child creation/parent update:", err);
      Alert.alert(
        t("errorTitle") || "Error",
        err.message || t("childCreationFailed") || "Failed to create child"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingParents) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.textSecondary, marginTop: 10 }}>
          {t("loadingParents") || "Loading parents..."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("createChildTitle") || "Create Child"}
      </Text>

      <Text style={styles.label}>{t("firstName") || "First Name"}:</Text>
      <TextInput
        placeholder={t("firstName")}
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <Text style={styles.label}>{t("lastName") || "Last Name"}:</Text>
      <TextInput
        placeholder={t("lastName")}
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <Text style={styles.label}>{t("dateOfBirth") || "Date of Birth"}:</Text>
      <TextInput
        placeholder={t("dateOfBirthPlaceholder") || "YYYY-MM-DD"}
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        style={styles.input}
      />

      <Text style={styles.label}>{t("department") || "Department"}:</Text>
      <TextInput
        placeholder={t("department")}
        value={department}
        onChangeText={setDepartment}
        style={styles.input}
      />

      <Text style={styles.label}>{t("assignParent") || "Assign Parent"}:</Text>
      <View
        style={[
          styles.input,
          styles.pickerWrapper,
          { backgroundColor: theme.inputBackground },
        ]}
      >
        <Picker
          selectedValue={selectedParent}
          onValueChange={(value) => setSelectedParent(value)}
          style={{ color: theme.text }}
        >
          {parents.length > 0 ? (
            parents.map((parent) => (
              <Picker.Item
                key={parent.id}
                label={`${parent.firstName} ${parent.lastName}`}
                value={parent.id}
              />
            ))
          ) : (
            <Picker.Item
              label={t("noParentsFound") || "No parents found"}
              value=""
            />
          )}
        </Picker>
      </View>

      <TouchableOpacity
        onPress={handleCreateChild}
        disabled={loading}
        style={[
          styles.createButton,
          { backgroundColor: loading ? theme.primary + "50" : theme.primary },
        ]}
      >
        <Text style={styles.createButtonText}>
          {loading
            ? t("creating") || "Creating..."
            : t("createChild") || "Create Child"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
