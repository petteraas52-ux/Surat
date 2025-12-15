import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";

import { useAuthSession } from "@/providers/authctx";
import { Text, View } from "react-native";
import { useState } from "react";
import PinCheck from "@/components/PinCheck";

export default function RootLayout() {
  const { user, isLoading } = useAuthSession();
  const [pinUnlocked, setPinUnlocked] = useState(false);

  if (isLoading) {
    return (
      <View>
        <Text>Henter bruker...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href={"/authentication"} />;
  }

  if (!pinUnlocked) {
    return (
      <PinCheck
      uid={user.uid}
      onUnlocked={() => setPinUnlocked(true)}
      />
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
