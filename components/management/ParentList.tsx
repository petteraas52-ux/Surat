import { deleteParent, getAllParents } from "@/api/parentApi";
import { styles } from "@/components/modals/commonStyles";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { ParentProps } from "@/types/parentData";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ParentListProps {
  onEdit: (parent: ParentProps) => void;
}

export function ParentList({ onEdit }: ParentListProps) {
  const [parents, setParents] = useState<ParentProps[]>([]);
  const [displayQuery, setDisplayQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();
  const theme = useAppTheme();

  useEffect(() => {
    fetchParents();
  }, []);

  useEffect(() => {
    if (displayQuery !== searchQuery) {
      setIsDebouncing(true);
    }
    const handler = setTimeout(() => {
      setSearchQuery(displayQuery);
      setIsDebouncing(false);
    }, 500);
    return () => clearTimeout(handler);
  }, [displayQuery]);

  const fetchParents = async () => {
    try {
      const data = await getAllParents();
      setParents(data);
    } catch (err) {
      Alert.alert(t("errorTitle"), t("failedToLoadParents"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(t("confirmDelete"), t("deleteWarning"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteParent(id);
            fetchParents();
          } catch (err) {
            Alert.alert(t("errorTitle"), t("deleteFailed"));
          }
        },
      },
    ]);
  };

  const filtered = parents.filter(
    (p) =>
      `${p.firstName} ${p.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      p.eMail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color={theme.primary}
        style={{ marginTop: 20 }}
      />
    );

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            flexDirection: "row",
            alignItems: "center",
            paddingRight: 15,
            marginBottom: 10,
          },
        ]}
      >
        <TextInput
          placeholder={t("searchParentPlaceholder") || "Search parent..."}
          value={displayQuery}
          onChangeText={setDisplayQuery}
          style={{
            flex: 1,
            color: theme.text,
            height: "100%",
          }}
        />
        {isDebouncing ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : displayQuery.length > 0 ? (
          <TouchableOpacity onPress={() => setDisplayQuery("")}>
            <Ionicons
              name="close-circle"
              size={18}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {filtered.map((parent) => (
        <View
          key={parent.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
          }}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text
              style={{ color: theme.text, fontSize: 16, fontWeight: "600" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {parent.firstName} {parent.lastName}
            </Text>
            <Text
              style={{ color: theme.textSecondary, fontSize: 13 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {parent.eMail}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => onEdit(parent)}
              style={{ padding: 8 }}
            >
              <Ionicons name="pencil-outline" size={22} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(parent.id)}
              style={{ padding: 8 }}
            >
              <Ionicons name="trash-outline" size={22} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}
