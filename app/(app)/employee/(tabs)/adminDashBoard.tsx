// screens/AdminDashboard.tsx

import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateChildModal } from "../../../../components/modals/CreateChildModal";
import { CreateEmployeeModal } from "../../../../components/modals/CreateEmployeeModal";
import { CreateEventModal } from "../../../../components/modals/CreateEventModal";
import { CreateParentModal } from "../../../../components/modals/CreateParentModal";

const TABS = {
  PARENT: "Parent",
  EMPLOYEE: "Employee",
  CHILD: "Child",
  EVENT: "Event",
};

type TabKey = keyof typeof TABS;

export default function AdminDashboardScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("PARENT");
  const theme = useAppTheme();
  const { t } = useI18n();

  const renderContent = () => {
    // Reverting to clean conditional rendering
    switch (activeTab) {
      case "PARENT":
        return <CreateParentModal />;
      case "EMPLOYEE":
        return <CreateEmployeeModal />;
      case "CHILD":
        return <CreateChildModal />;
      case "EVENT":
        return <CreateEventModal />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t("adminDashBoardTitle")}
        </Text>
      </View>

      <View style={[styles.tabBar, { borderBottomColor: theme.border }]}>
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
      </View>

      <ScrollView style={styles.contentContainer}>{renderContent()}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
  },
});
