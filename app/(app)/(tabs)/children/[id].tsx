// children mappe og denne filen [id].tsx er bare for å teste kommentarbosken på en tom side

import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import CommentBox from "@/components/commentBox";

export default function ChildDetails() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Barn ID: {id}
      </Text>

      <CommentBox childId={String(id)} />
    </SafeAreaView>
  );
}