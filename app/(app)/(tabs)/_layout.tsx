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
        name="test-screen"
        options={{
          title: "TEST",
          tabBarIcon: () => (
            <Ionicons name="warning-outline" size={24} color="purple" />
          ),
        }}
      />
    </Tabs>
    
  );
}
