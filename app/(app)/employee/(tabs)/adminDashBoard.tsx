import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";

// Modals
import { CreateChildModal } from "../../../../components/modals/CreateChildModal";
import { ManageDepartmentsModal } from "../../../../components/modals/CreateDepartmentModal";
import { CreateEmployeeModal } from "../../../../components/modals/CreateEmployeeModal";
import { CreateEventModal } from "../../../../components/modals/CreateEventModal";
import { CreateParentModal } from "../../../../components/modals/CreateParentModal";

// Management Lists
import { ChildList } from "../../../../components/management/ChildList";
import { DepartmentList } from "../../../../components/management/DepartmentList";
import { EmployeeList } from "../../../../components/management/EmployeeList";
import { EventList } from "../../../../components/management/EventList";
import { ParentList } from "../../../../components/management/ParentList";

// Shared Edit Modal
import { AdminEditModal } from "../../../../components/modals/AdminEditModal";

const TABS = {
  PARENT: "Parent",
  EMPLOYEE: "Employee",
  CHILD: "Child",
  EVENT: "Event",
  DEPARTMENT: "Department",
};

type TabKey = keyof typeof TABS;
type DashboardMode = "CREATE" | "MANAGE";

export default function AdminDashboardScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("PARENT");
  const [mode, setMode] = useState<DashboardMode>("CREATE");

  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<TabKey | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const theme = useAppTheme();
  const { t } = useI18n();

  const handleOpenEdit = (item: any, type: TabKey) => {
    setEditingItem(item);
    setEditType(type);
  };

  const handleCloseEdit = () => {
    setEditingItem(null);
    setEditType(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const renderContent = () => {
    if (mode === "CREATE") {
      switch (activeTab) {
        case "PARENT":
          return <CreateParentModal />;
        case "EMPLOYEE":
          return <CreateEmployeeModal />;
        case "CHILD":
          return <CreateChildModal />;
        case "EVENT":
          return <CreateEventModal />;
        case "DEPARTMENT":
          return <ManageDepartmentsModal />;
        default:
          return null;
      }
    } else {
      switch (activeTab) {
        case "PARENT":
          return (
            <ParentList
              key={`p-${refreshTrigger}`}
              onEdit={(item) => handleOpenEdit(item, "PARENT")}
            />
          );
        case "CHILD":
          return (
            <ChildList
              key={`c-${refreshTrigger}`}
              onEdit={(item) => handleOpenEdit(item, "CHILD")}
            />
          );
        case "EMPLOYEE":
          return (
            <EmployeeList
              key={`e-${refreshTrigger}`}
              onEdit={(item) => handleOpenEdit(item, "EMPLOYEE")}
            />
          );
        case "EVENT":
          return (
            <EventList
              key={`ev-${refreshTrigger}`}
              onEdit={(item) => handleOpenEdit(item, "EVENT")}
            />
          );
        case "DEPARTMENT":
          return (
            <DepartmentList
              key={`d-${refreshTrigger}`}
              onEdit={(item) => handleOpenEdit(item, "DEPARTMENT")}
            />
          );
        default:
          return null;
      }
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={["top", "left", "right"]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t("adminDashBoardTitle")}
        </Text>
      </View>

      <View
        style={[
          styles.modeToggleContainer,
          { backgroundColor: theme.inputBackground },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === "CREATE" && { backgroundColor: theme.primary },
          ]}
          onPress={() => setMode("CREATE")}
        >
          <Text
            style={[
              styles.modeButtonText,
              { color: mode === "CREATE" ? "#FFF" : theme.textSecondary },
            ]}
          >
            {t("createMode")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === "MANAGE" && { backgroundColor: theme.primary },
          ]}
          onPress={() => setMode("MANAGE")}
        >
          <Text
            style={[
              styles.modeButtonText,
              { color: mode === "MANAGE" ? "#FFF" : theme.textSecondary },
            ]}
          >
            {t("manageMode")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.tabBar, { borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(Object.keys(TABS) as TabKey[]).map((key) => (
            <Pressable
              key={key}
              style={[
                styles.tabItem,
                activeTab === key && { borderBottomColor: theme.primary },
              ]}
              onPress={() => setActiveTab(key)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === key ? theme.primary : theme.textSecondary,
                  },
                ]}
              >
                {t(`${key.toLowerCase()}`)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>

      {editingItem && (
        <AdminEditModal
          visible={!!editingItem}
          item={editingItem}
          type={editType as any}
          onClose={handleCloseEdit}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 10 },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  modeToggleContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 8,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  modeButtonText: { fontWeight: "bold", fontSize: 14 },
  tabBar: { flexDirection: "row", borderBottomWidth: 1, marginBottom: 10 },
  tabItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabText: { fontWeight: "600" },
  contentContainer: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 100 },
});
