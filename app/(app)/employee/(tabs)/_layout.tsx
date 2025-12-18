import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

/**
 * TAB NAVIGATION (EMPLOYEE/ADMIN)
 * This component manages the bottom tab bar for staff members.
 * It includes conditional logic to show/hide the Admin Dashboard.
 */
export default function TabBar() {
  const { t } = useI18n();
  const theme = useAppTheme();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * PERMISSION CHECK EFFECT
   * On mount, we listen to the Auth state. If a user is logged in,
   * we fetch their document from the 'employees' collection to check their 'role'.
   * This determines if the "Admin" tab should be visible.
   */
  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const empDoc = await getDoc(doc(db, "employees", user.uid));
          if (empDoc.exists()) {
            // Check if the staff member has the 'admin' string in their role field
            setIsAdmin(empDoc.data().role === "admin");
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.log("Access restricted. Defaulting to non-admin.");
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Prevent UI flicker: show a loader while checking permissions
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
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
      {/* 1. Main Dashboard: Accessible to all employees */}
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabTitleDepartment"),
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

      {/* 2. Personal Profile: Settings and personal info */}
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

      {/* 3. ADMIN DASHBOARD (CONDITIONAL)
          CRUCIAL LOGIC: The 'href' property. 
          If isAdmin is false, we set href to null. This removes the tab 
          from the bottom bar entirely, preventing non-admins from even seeing it.
      */}
      <Tabs.Screen
        name="adminDashBoard"
        options={{
          title: t("tabTitleAdmin"),
          headerShown: false,
          href: (isAdmin
            ? "/(app)/employee/(tabs)/adminDashBoard"
            : null) as any,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="build-outline"
              size={24}
              color={focused ? theme.tabIconSelected : theme.tabIconDefault}
            />
          ),
        }}
      />
    </Tabs>
  );
}
