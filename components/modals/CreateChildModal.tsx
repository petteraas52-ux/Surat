import { createChild } from "@/api/childrenApi";
import { getAllDepartments } from "@/api/departmentApi";
import { addChildToParent, getAllParents } from "@/api/parentApi";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { DepartmentProps } from "@/types/departmentData";
import { ParentProps } from "@/types/parentData";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { styles } from "./commonStyles";

export function CreateChildModal() {
  const { t } = useI18n();
  const theme = useAppTheme();

  const [parents, setParents] = useState<ParentProps[]>([]);
  const [departments, setDepartments] = useState<DepartmentProps[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);

  const [parentOpen, setParentOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<string>("");

  const [deptOpen, setDeptOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>("");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [parentsData, deptsData] = await Promise.all([
          getAllParents(),
          getAllDepartments(),
        ]);

        setParents(parentsData);
        setDepartments(deptsData);

        if (parentsData.length > 0) setSelectedParent(parentsData[0].id);
        if (deptsData.length > 0) setSelectedDept(deptsData[0].name);
      } catch (err) {
        console.error("Error loading data:", err);
        Alert.alert(t("errorTitle"), t("failedToLoadParents"));
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, []);

  const parentItems = parents.map((p) => ({
    label: `${p.firstName} ${p.lastName}`,
    value: p.id,
  }));

  const deptItems = departments.map((d) => ({
    label: d.name,
    value: d.name,
  }));

  const handleCreateChild = async () => {
    if (!firstName || !lastName || !selectedParent || !selectedDept) {
      Alert.alert(t("missingFieldsTitle"), t("completeRequiredFields"));
      return;
    }

    try {
      setLoading(true);
      const childUid = await createChild({
        firstName,
        lastName,
        dateOfBirth,
        allergies: [],
        imageUri: "",
        parents: [selectedParent],
        checkedIn: false,
        department: selectedDept,
      });

      if (!childUid) throw new Error("UID Error");

      await addChildToParent(selectedParent, childUid);

      Alert.alert(t("successTitle"), t("childCreatedMessage"));

      setFirstName("");
      setLastName("");
      setDateOfBirth("");
    } catch (err: any) {
      Alert.alert(t("errorTitle"), t("childCreationFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
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
      <View style={{ zIndex: 2000 }}>
        <DropDownPicker
          open={deptOpen}
          value={selectedDept}
          items={deptItems}
          setOpen={setDeptOpen}
          setValue={setSelectedDept}
          placeholder={t("department")}
          searchable={true}
          listMode="SCROLLVIEW"
          onOpen={() => setParentOpen(false)}
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
          containerStyle={{ marginBottom: deptOpen ? 150 : 15 }}
        />
      </View>

      <Text style={styles.label}>{t("assignParent")}:</Text>
      <View style={{ zIndex: 1000 }}>
        <DropDownPicker
          open={parentOpen}
          value={selectedParent}
          items={parentItems}
          setOpen={setParentOpen}
          setValue={setSelectedParent}
          placeholder={t("selectParent")}
          searchable={true}
          searchPlaceholder={t("searchParentPlaceholder")}
          listMode="SCROLLVIEW"
          onOpen={() => setDeptOpen(false)}
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
          containerStyle={{ marginBottom: parentOpen ? 150 : 15 }}
        />
      </View>

      <TouchableOpacity
        onPress={handleCreateChild}
        disabled={loading}
        style={[
          styles.createButton,
          {
            backgroundColor: loading ? theme.primary + "50" : theme.primary,
            marginTop: 10,
          },
        ]}
      >
        <Text style={styles.createButtonText}>
          {loading ? t("creating") : t("createChild")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
