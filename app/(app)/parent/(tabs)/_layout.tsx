/**
 * PARENT TAB BAR NAVIGATION
 * * ROLE:
 * This component defines the primary navigation for Parent users.
 * Unlike the Employee TabBar, this version is simplified, focusing
 * only on the children overview and the parent's profile.
 * * LOGIC:
 * 1. Theme Integration: Uses 'useAppTheme' to dynamically swap colors for Light/Dark modes.
 * 2. Localization: Uses 'useI18n' to translate tab labels based on the user's language settings.
 */

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
        // Default title fallback
        title: t("tabTitleChildren"),
        // Active/Inactive states driven by the app theme
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
      {/* 1. CHILDREN OVERVIEW (HOME)
          The landing page for parents to see their children's check-in status.
      */}
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

      {/* 2. PARENT PROFILE
          Settings, language switching, and personal contact information.
      */}
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
