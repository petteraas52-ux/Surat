import { updateChild } from "@/api/children";
import { updateDepartment } from "@/api/department";
import { updateEmployee } from "@/api/employees";
import { updateEvent } from "@/api/event";
import { updateParent } from "@/api/parents";
import { styles } from "@/components/modals/commonStyles";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import React, { useState } from "react";
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
            <Text style={styles.title}>{t("edit")}</Text>
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
          >
            {type === "DEPARTMENT" && (
              <>
                <Text style={styles.label}>{t("departmentName")}</Text>
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
                <Text style={styles.label}>{t("firstName")}</Text>
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

                <Text style={styles.label}>{t("lastName")}</Text>
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
                <Text style={styles.label}>{t("title")}</Text>
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
                <Text style={styles.label}>{t("description")}</Text>
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
                <Text style={styles.label}>{t("phone")}</Text>
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
                <Text style={styles.label}>{t("department")}</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.text,
                    },
                  ]}
                  value={formData.department}
                  onChangeText={(v) =>
                    setFormData({ ...formData, department: v })
                  }
                />
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
