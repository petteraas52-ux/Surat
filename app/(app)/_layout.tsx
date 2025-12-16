import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";

import { useState } from "react";
import PinCheck from "@/components/PinCheck";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { useAuthSession } from "@/providers/authctx";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function RootLayout() {
  const { user, isLoading } = useAuthSession();
  const { t } = useI18n();
  const theme = useAppTheme();
  const [pinUnlocked, setPinUnlocked] = useState(false);

  if (isLoading) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          {t("loadingUser")}
        </Text>
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
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.backgroundSecondary,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: "600",
        },
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen
        name="employee/(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="parent/(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="role-error" options={{ title: "Account Issue" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});
