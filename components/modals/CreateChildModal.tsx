/**
 * CREATE CHILD MODAL
 * * ROLE:
 * An administrative form for registering new children. It handles complex
 * relational data by linking the new child to existing Parents and Departments.
 * * KEY LOGIC:
 * 1. Parallel Data Loading: Uses Promise.all to fetch parents and departments
 * simultaneously on mount to reduce loading flicker.
 * 2. Cross-Linked Updates: Performs an "atomic" operation—creating the child
 * record first, then updating the Parent's document with the new child's UID.
 * 3. Dropdown Management: Implements exclusive 'onOpen' logic to ensure that
 * when the Department picker opens, the Parent picker closes (and vice versa)
 * to prevent UI overlap.
 */

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
import { styles as commonStyles } from "./commonStyles";

export function CreateChildModal() {
  const { t } = useI18n();
  const theme = useAppTheme();

  // --- DATA LISTS ---
  const [parents, setParents] = useState<ParentProps[]>([]);
  const [departments, setDepartments] = useState<DepartmentProps[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // --- FORM FIELDS ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);

  // --- PICKER STATE ---
  const [parentOpen, setParentOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<string>("");
  const [deptOpen, setDeptOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>("");

  /**
   * INITIALIZATION
   * Fetches required relational data before showing the form.
   */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [parentsData, deptsData] = await Promise.all([
          getAllParents(),
          getAllDepartments(),
        ]);

        setParents(parentsData);
        setDepartments(deptsData);

        // Pre-select first options to improve UX speed
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

  /**
   * CREATION FLOW
   * 1. Validate local state.
   * 2. Push child to 'children' collection.
   * 3. Update parent's 'children' array with the new ID.
   */
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

      // Relational Linkage
      await addChildToParent(selectedParent, childUid);

      Alert.alert(t("successTitle"), t("childCreatedMessage"));

      // Reset form
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
      <View style={commonStyles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <Text style={[commonStyles.title, { color: theme.text }]}>
        {t("createChildTitle")}
      </Text>

      {/* TEXT INPUTS */}
      <Text style={[commonStyles.label, { color: theme.text }]}>
        {t("firstName")}:
      </Text>
      <TextInput
        placeholder={t("firstName")}
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor={theme.textMuted}
        style={[
          commonStyles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
      />

      <Text style={[commonStyles.label, { color: theme.text }]}>
        {t("lastName")}:
      </Text>
      <TextInput
        placeholder={t("lastName")}
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor={theme.textMuted}
        style={[
          commonStyles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
      />

      <Text style={[commonStyles.label, { color: theme.text }]}>
        {t("dateOfBirth")}:
      </Text>
      <TextInput
        placeholder={t("dateOfBirthPlaceholder")}
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        placeholderTextColor={theme.textMuted}
        style={[
          commonStyles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
      />

      {/* DEPARTMENT SELECTOR (Higher zIndex for overlay) */}
      <Text style={[commonStyles.label, { color: theme.text }]}>
        {t("department")}:
      </Text>
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
          onOpen={() => setParentOpen(false)} // UX: Close other dropdowns
          style={[
            commonStyles.input,
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

      {/* PARENT ASSIGNMENT SELECTOR */}
      <Text style={[commonStyles.label, { color: theme.text }]}>
        {t("assignParent")}:
      </Text>
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
          onOpen={() => setDeptOpen(false)} // UX: Close other dropdowns
          style={[
            commonStyles.input,
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
          commonStyles.createButton,
          {
            backgroundColor: loading ? theme.primary + "50" : theme.primary,
            marginTop: 10,
          },
        ]}
      >
        <Text style={commonStyles.createButtonText}>
          {loading ? t("creating") : t("createChild")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
