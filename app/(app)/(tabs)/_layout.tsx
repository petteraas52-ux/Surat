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
          tabBarIcon: () => <AntDesign name="home" size={24} color="purple" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: () => (
            <Ionicons name="person-circle" size={24} color="purple" />
          ),
        }}
      />
      <Tabs.Screen
        name="create-parent"
        options={{
          title: "ParentCreation",
          tabBarIcon: () => (
            <Ionicons name="warning-outline" size={24} color="purple" />
          ),
        }}
      />
      <Tabs.Screen
        name="create-child"
        options={{
          title: "ChildCreation",
          tabBarIcon: () => (
            <Ionicons name="warning-outline" size={24} color="purple" />
          ),
        }}
      />
      <Tabs.Screen
        name="create-event"
        options={{
          title: "EventCreation",
          tabBarIcon: () => (
            <Ionicons name="warning-outline" size={24} color="purple" />
          ),
        }}
      />
    </Tabs>
  );
}
