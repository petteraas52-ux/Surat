import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";

import { useAuthSession } from "@/providers/authctx";
import { ActivityIndicator, Text, View, StyleSheet } from "react-native";
import { useI18n } from "@/hooks/useI18n";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function RootLayout() {
  const { user, isLoading } = useAuthSession();
  const { t } = useI18n();
  const theme = useAppTheme();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>{t("loadingUser")}</Text>
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
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
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