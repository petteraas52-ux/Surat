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
  Text,
  TextInput,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { styles } from "./commonStyles";

export function CreateEmployeeModal() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState<DepartmentProps[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

  const theme = useAppTheme();
  const { t } = useI18n();

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

  const handleCreateEmployee = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !selectedDepartment ||
      !password
    ) {
      Alert.alert(t("missingFieldsTitle"), t("missingFieldsMessage"));
      return;
    }

    try {
      setLoading(true);

      await createAccountViaAdmin(
        email,
        password,
        `${firstName} ${lastName}`,
        "employee",
        {
          firstName,
          lastName,
          eMail: email,
          phone,
          department: selectedDepartment,
          imageUri: "",
        }
      );

      Alert.alert(t("successTitle"), t("employeeCreatedMessage"));

      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setSelectedDepartment(null);
      setPassword("");
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
    <View style={styles.container}>
      <Text style={styles.title}>{t("createEmployeeTitle")}</Text>

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

      <Text style={styles.label}>{t("email")}:</Text>
      <TextInput
        placeholder={t("email")}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <Text style={styles.label}>{t("phone")}:</Text>
      <TextInput
        placeholder={t("phone")}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Text style={styles.label}>{t("department")}:</Text>
      <View style={{ zIndex: 1000 }}>
        <DropDownPicker
          open={open}
          value={selectedDepartment}
          items={deptItems}
          setOpen={setOpen}
          setValue={setSelectedDepartment}
          placeholder={t("department")}
          searchable={true}
          searchPlaceholder={t("searchParentPlaceholder")}
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
          containerStyle={{ marginBottom: open ? 160 : 15 }}
        />
      </View>

      <Text style={styles.label}>{t("tempPassword")}:</Text>
      <TextInput
        placeholder={t("tempPassword")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
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
    </View>
  );
}
