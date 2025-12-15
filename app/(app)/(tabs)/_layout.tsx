import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabBar() {
  return (
    <Tabs
      screenOptions={{
        title: "Mine barn",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Mine barn",
          headerShown: false,
          tabBarIcon: () => <AntDesign name="home" size={24} color="purple" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          headerShown: false,
          tabBarIcon: () => (
            <Ionicons name="person-circle" size={24} color="purple" />
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
