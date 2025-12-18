import { updateChild } from "@/api/childrenApi";
import { getAllDepartments, updateDepartment } from "@/api/departmentApi";
import { updateEmployee } from "@/api/employeApi";
import { updateEvent } from "@/api/eventApi";
import { updateParent } from "@/api/parentApi";
import { styles } from "@/components/modals/commonStyles";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { DepartmentProps } from "@/types/departmentData";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface EditModalProps {
  visible: boolean;
  item: any;
  type: "PARENT" | "CHILD" | "EMPLOYEE" | "EVENT" | "DEPARTMENT";
  onClose: () => void;
}

export function AdminEditModal({
  visible,
  item,
  type,
  onClose,
}: EditModalProps) {
  const { t } = useI18n();
  const theme = useAppTheme();

  const [formData, setFormData] = useState({ ...item });
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState<DepartmentProps[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFormData({ ...item });
  }, [item]);

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

  const handleUpdate = async () => {
    setLoading(true);
    try {
      if (type === "PARENT") await updateParent(item.id, formData);
      else if (type === "CHILD") await updateChild(item.id, formData);
      else if (type === "EMPLOYEE") await updateEmployee(item.id, formData);
      else if (type === "EVENT") await updateEvent(item.id, formData);
      else if (type === "DEPARTMENT") await updateDepartment(item.id, formData);

      Alert.alert(t("successTitle"), t("updateSuccessful"));
      onClose();
    } catch (err) {
      console.error(err);
      Alert.alert(t("errorTitle"), t("updateFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: theme.background, flex: 1, paddingTop: 30 },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              marginBottom: 20,
            }}
          >
            <Text style={[styles.title, {color: theme.text}]}>{t("edit")}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text
                style={{
                  color: theme.primary,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {t("cancel")}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ paddingHorizontal: 20 }}
            contentContainerStyle={{ paddingBottom: 40 }}
            nestedScrollEnabled={true}
          >
            {type === "DEPARTMENT" && (
              <>
                <Text style={[styles.label, { color: theme.text }]}>{t("departmentName")}</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.text,
                    },
                  ]}
                  value={formData.name}
                  onChangeText={(v) => setFormData({ ...formData, name: v })}
                />
              </>
            )}

            {type !== "EVENT" && type !== "DEPARTMENT" && (
              <>
                <Text style={[styles.label, { color: theme.text }]}>{t("firstName")}</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.text,
                    },
                  ]}
                  value={formData.firstName}
                  onChangeText={(v) =>
                    setFormData({ ...formData, firstName: v })
                  }
                />

                <Text style={[styles.label, { color: theme.text }]}>{t("lastName")}</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.text,
                    },
                  ]}
                  value={formData.lastName}
                  onChangeText={(v) =>
                    setFormData({ ...formData, lastName: v })
                  }
                />
              </>
            )}

            {type === "EVENT" && (
              <>
                <Text style={[styles.label, { color: theme.text }]}>
                  {t("title")}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.text,
                    },
                  ]}
                  value={formData.title}
                  onChangeText={(v) => setFormData({ ...formData, title: v })}
                />
                <Text style={[styles.label, { color: theme.text }]}>
                  {t("description")}
                </Text>
                <TextInput
                  multiline
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.text,
                      height: 80,
                    },
                  ]}
                  value={formData.description}
                  onChangeText={(v) =>
                    setFormData({ ...formData, description: v })
                  }
                />
              </>
            )}

            {(type === "PARENT" || type === "EMPLOYEE") && (
              <>
                <Text style={[styles.label, { color: theme.text }]}>{t("phone")}</Text>
                <TextInput
                  keyboardType="phone-pad"
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.text,
                    },
                  ]}
                  value={formData.phone}
                  onChangeText={(v) => setFormData({ ...formData, phone: v })}
                />
              </>
            )}

            {(type === "CHILD" || type === "EMPLOYEE" || type === "EVENT") && (
              <>
                <Text style={[styles.label, { color: theme.text }]}>{t("department")}:</Text>
                <View style={{ zIndex: 1000 }}>
                  <DropDownPicker
                    open={open}
                    value={formData.department}
                    items={deptItems}
                    setOpen={setOpen}
                    setValue={(callback) => {
                      const value = callback(formData.department);
                      setFormData({ ...formData, department: value });
                    }}
                    placeholder={t("department")}
                    searchable={true}
                    searchPlaceholder={t("searchDepartmentPlaceholder")}
                    listMode="SCROLLVIEW"
                    loading={loadingDepts}
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
              </>
            )}

            <TouchableOpacity
              style={[
                styles.createButton,
                {
                  marginTop: 30,
                  backgroundColor: loading
                    ? theme.primary + "50"
                    : theme.primary,
                },
              ]}
              onPress={handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.createButtonText}>{t("saveChanges")}</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
