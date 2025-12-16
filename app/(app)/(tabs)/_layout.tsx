import { useI18n } from "@/hooks/useI18n";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useAppTheme } from "@/hooks/useAppTheme"; 

export default function TabBar() {
  const { t } = useI18n();
  const theme = useAppTheme();
  return (
    <Tabs
      screenOptions={{
        title: t("tabTitleChildren"),
        tabBarActiveTintColor: theme.tabIconSelected, 
        tabBarInactiveTintColor: theme.tabIconDefault, 
        tabBarStyle: {
          backgroundColor: theme.backgroundSecondary, 
        },
        headerStyle: {
          backgroundColor: theme.backgroundSecondary, 
        },
        headerTintColor: theme.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabTitleChildren"),
          headerShown: false,
          tabBarIcon: ({ focused }) => <AntDesign name="home" size={24} color={focused ? theme.tabIconSelected : theme.tabIconDefault} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabTitleProfile"),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons name="person-circle" size={24} color={focused ? theme.tabIconSelected : theme.tabIconDefault} />
          ),
        }}
      />

      <Tabs.Screen
        name="employee_overview"
        options={{
          title: "Alle barn",
          headerShown: false,
          tabBarIcon: () => (
            <AntDesign name="team" size={24} color="purple" />
          ),
        }}
      />
      {/*
      <Tabs.Screen
        name="create-parent"
        options={{
          title: "ParentCreation",
          headerShown: false,
          tabBarIcon: () => (
            <Ionicons name="warning-outline" size={24} color="purple" />
          ),
        }}
      />
      <Tabs.Screen
        name="create-child"
        options={{
          title: "ChildCreation",
          headerShown: false,
          tabBarIcon: () => (
            <Ionicons name="warning-outline" size={24} color="purple" />
          ),
        }}
      />
      <Tabs.Screen
        name="create-event"
        options={{
          title: "EventCreation",
          headerShown: false,
          tabBarIcon: () => (
            <Ionicons name="warning-outline" size={24} color="purple" />
          ),
        }}
      />
      */}
    </Tabs>
  );
}
