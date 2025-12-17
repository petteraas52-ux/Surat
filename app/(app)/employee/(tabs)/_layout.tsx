import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function TabBar() {
  const { t } = useI18n();
  const theme = useAppTheme();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const empDoc = await getDoc(doc(db, "employees", user.uid));
          if (empDoc.exists()) {
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

    return () => unsubscribe();
  }, []);

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
