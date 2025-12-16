import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

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
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="home"
              size={24}
              color={focused ? theme.tabIconSelected : theme.tabIconDefault}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="adminDashBoard"
        options={{
          title: t("tabTitleAdmin"),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-circle"
              size={24}
              color={focused ? theme.tabIconSelected : theme.tabIconDefault}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabTitleProfile"),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-circle"
              size={24}
              color={focused ? theme.tabIconSelected : theme.tabIconDefault}
            />
          ),
        }}
      />
    </Tabs>
  );
}
