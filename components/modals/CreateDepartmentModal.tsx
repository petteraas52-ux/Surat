import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
} from "@/api/department";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { DepartmentProps } from "@/types/department";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./commonStyles";

export function ManageDepartmentsModal() {
  const [departments, setDepartments] = useState<DepartmentProps[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { t } = useI18n();
  const theme = useAppTheme();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await getAllDepartments();
      setDepartments(data);
    } catch (err) {
      Alert.alert(t("errorTitle"), t("failedToLoadDepartments"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async () => {
    if (!newName.trim()) return;
    try {
      setSubmitting(true);
      await createDepartment(newName.trim());
      setNewName("");
      await loadDepartments();
      Alert.alert(t("successTitle"), t("departmentCreated"));
    } catch (err) {
      Alert.alert(t("errorTitle"), t("failedToCreateDepartment"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(t("confirmDelete"), t("deleteDepartmentWarning"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          await deleteDepartment(id);
          loadDepartments();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("manageDepartments")}</Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={styles.label}>{t("departmentName")}:</Text>
        <TextInput
          placeholder={t("departmentNamePlaceholder")}
          value={newName}
          onChangeText={setNewName}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={handleAddDepartment}
          disabled={submitting}
          style={[
            styles.createButton,
            {
              backgroundColor: submitting
                ? theme.primary + "50"
                : theme.primary,
            },
          ]}
        >
          <Text style={styles.createButtonText}>
            {submitting ? t("creating") : t("addDepartment")}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{ height: 1, backgroundColor: theme.border, marginVertical: 10 }}
      />

      <FlatList
        data={departments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: theme.border,
            }}
          >
            <Text style={{ color: theme.text, fontSize: 16 }}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons
                name="trash-outline"
                size={20}
                color={theme.error || "red"}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
