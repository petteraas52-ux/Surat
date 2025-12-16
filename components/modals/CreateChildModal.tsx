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
        Alert.alert(t("errorTitle"), t("failedToLoadParents"));
      } finally {
        setLoadingParents(false);
      }
    };

    loadParents();
  }, []);

  const handleCreateChild = async () => {
    if (!firstName || !lastName || !selectedParent) {
      Alert.alert(t("missingFieldsTitle"), t("completeRequiredFields"));
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

      Alert.alert(t("successTitle"), t("childCreatedMessage"));

      setFirstName("");
      setLastName("");
      setDateOfBirth("");
      setDepartment("");
    } catch (err: any) {
      console.error("Error during child creation/parent update:", err);
      Alert.alert(
        t("errorTitle") || "Error",
        err.message || t("childCreationFailed")
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
          {t("loadingParents")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("createChildTitle")}</Text>

      <Text style={styles.label}>{t("firstName")}:</Text>
      <TextInput
        placeholder={t("firstName")}
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <Text style={styles.label}>{t("lastName")}:</Text>
      <TextInput
        placeholder={t("lastName")}
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <Text style={styles.label}>{t("dateOfBirth")}:</Text>
      <TextInput
        placeholder={t("dateOfBirthPlaceholder")}
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        style={styles.input}
      />

      <Text style={styles.label}>{t("department")}:</Text>
      <TextInput
        placeholder={t("department")}
        value={department}
        onChangeText={setDepartment}
        style={styles.input}
      />

      <Text style={styles.label}>{t("assignParent")}:</Text>
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
            <Picker.Item label={t("noParentsFound")} value="" />
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
          {loading ? t("creating") : t("createChild")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
