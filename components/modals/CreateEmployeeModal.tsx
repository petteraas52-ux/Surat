/**
 * CREATE EMPLOYEE MODAL
 * * ROLE:
 * Orchestrates the dual-action of creating a Firebase Authentication user
 * and a corresponding Firestore employee profile.
 * * KEY LOGIC:
 * 1. Admin Provisioning: Uses a specialized 'createAccountViaAdmin' API
 * which typically handles user creation without logging the admin out.
 * 2. Role-Based Access Control (RBAC): Implements a Role picker to define
 * permissions (Admin vs. Employee) at the moment of account creation.
 * 3. Form Sanitization: Enforces 'autoCapitalize="none"' for emails and
 * 'keyboardType' optimizations for phones to ensure data validity.
 */

import { createAccountViaAdmin } from "@/api/adminApi";
import { getAllDepartments } from "@/api/departmentApi";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { DepartmentProps } from "@/types/departmentData";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { styles } from "./commonStyles";

export function CreateEmployeeModal() {
  const { t } = useI18n();
  const theme = useAppTheme();

  // --- FORM STATE ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- DROPDOWN STATE: DEPARTMENTS ---
  const [departments, setDepartments] = useState<DepartmentProps[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [deptOpen, setDeptOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  // --- DROPDOWN STATE: ROLES ---
  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "employee">(
    "employee"
  );

  const roleItems = [
    { label: t("roleEmployee"), value: "employee" },
    { label: t("roleAdmin"), value: "admin" },
  ];

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

  /**
   * EXECUTE ACCOUNT PROVISIONING
   * Creates Auth record first, then the Firestore Profile.
   */
  const handleCreateEmployee = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !selectedDept ||
      !password
    ) {
      Alert.alert(t("missingFieldsTitle"), t("missingFieldsMessage"));
      return;
    }

    try {
      setLoading(true);

      // Standardizes full name for Auth record display name
      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      await createAccountViaAdmin(
        email.trim().toLowerCase(),
        password,
        fullName,
        selectedRole,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          eMail: email.trim().toLowerCase(),
          phone: phone.trim(),
          department: selectedDept,
          imageUri: "",
          role: selectedRole,
        }
      );

      Alert.alert(t("successTitle"), t("employeeCreatedMessage"));

      // Reset form on success
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setSelectedDept(null);
      setPassword("");
      setSelectedRole("employee");
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        t("errorTitle"),
        error.message || t("employeeCreationFailed")
      );
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
      nestedScrollEnabled={true}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        {t("createEmployeeTitle")}
      </Text>

      {/* ROLE SELECTION */}
      <Text style={[styles.label, { color: theme.text }]}>{t("Role")}:</Text>
      <View style={{ zIndex: 3000 }}>
        <DropDownPicker
          open={roleOpen}
          value={selectedRole}
          items={roleItems}
          setOpen={setRoleOpen}
          setValue={setSelectedRole}
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
          containerStyle={{ marginBottom: 15 }}
        />
      </View>

      {/* PERSONAL INFO */}
      <Text style={[styles.label, { color: theme.text }]}>
        {t("firstName")}:
      </Text>
      <TextInput
        placeholder={t("firstName")}
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor={theme.placeholder}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
      />

      <Text style={[styles.label, { color: theme.text }]}>
        {t("lastName")}:
      </Text>
      <TextInput
        placeholder={t("lastName")}
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor={theme.placeholder}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
      />

      {/* CONTACT INFO */}
      <Text style={[styles.label, { color: theme.text }]}>{t("email")}:</Text>
      <TextInput
        placeholder={t("email")}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={theme.placeholder}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
      />

      <Text style={[styles.label, { color: theme.text }]}>{t("phone")}:</Text>
      <TextInput
        placeholder={t("phone")}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholderTextColor={theme.placeholder}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
      />

      {/* DEPARTMENT SELECTION */}
      <Text style={[styles.label, { color: theme.text }]}>
        {t("department")}:
      </Text>
      <View style={{ zIndex: 2000 }}>
        <DropDownPicker
          open={deptOpen}
          value={selectedDept}
          items={deptItems}
          setOpen={setDeptOpen}
          setValue={setSelectedDept}
          onOpen={() => setRoleOpen(false)}
          placeholder={t("department")}
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
          containerStyle={{ marginBottom: deptOpen ? 160 : 15 }}
        />
      </View>

      {/* SECURITY */}
      <Text style={[styles.label, { color: theme.text }]}>
        {t("tempPassword")}:
      </Text>
      <TextInput
        placeholder={t("tempPassword")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={theme.placeholder}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
      />

      <Pressable
        onPress={handleCreateEmployee}
        disabled={loading}
        style={[
          styles.createButton,
          {
            backgroundColor: loading ? theme.primary + "50" : theme.primary,
            marginTop: 25,
          },
        ]}
      >
        <Text style={styles.createButtonText}>
          {loading ? t("creating") : t("createEmployee")}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
