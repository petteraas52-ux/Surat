/**
 * ROOT LAYOUT (GATEKEEPER)
 * * ROLE:
 * This is the top-level navigation wrapper. It handles the core application
 * state transitions: Loading -> Authenticating -> Security Check -> Routing.
 * * LOGIC FLOW:
 * 1. Auth Check: If no user is found, redirect to the /authentication flow.
 * 2. Security Check: If a user is logged in but hasn't entered their PIN, show PinCheck.
 * 3. Routing: Once authenticated and unlocked, provide the Stack navigation for role-based folders.
 */

import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";

import PinCheck from "@/components/PinCheck";
import { useState } from "react";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { useAuthSession } from "@/providers/authctx";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function RootLayout() {
  const { user, isLoading } = useAuthSession();
  const { t } = useI18n();
  const theme = useAppTheme();

  // PIN SECURITY STATE
  // This ensures that even if the Firebase session is active,
  // the user must provide their 4-digit PIN to access the dashboard.
  const [pinUnlocked, setPinUnlocked] = useState(false);

  /**
   * 1. INITIAL LOADING STATE
   * While the Firebase Auth provider is checking the persistent login token.
   */
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

  /**
   * 2. AUTHENTICATION REDIRECT
   * If the user is not logged in (null), they are sent to the auth folder.
   */
  if (!user) {
    return <Redirect href={"/authentication"} />;
  }

  /**
   * 3. SECURITY PIN OVERLAY
   * This is a "Controlled Gateway". If pinUnlocked is false, we return
   * the PinCheck component instead of the Stack navigation.
   */
  if (!pinUnlocked) {
    return <PinCheck uid={user.uid} onUnlocked={() => setPinUnlocked(true)} />;
  }

  /**
   * 4. MAIN NAVIGATION STACK
   * Defines the routing table for the authenticated sections of the app.
   */
  return (
    <Stack
      screenOptions={{
        // Global Theme Injection
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
      {/* EMPLOYEE SECTION */}
      <Stack.Screen
        name="employee/(tabs)"
        options={{
          headerShown: false,
        }}
      />

      {/* PARENT SECTION */}
      <Stack.Screen
        name="parent/(tabs)"
        options={{
          headerShown: false,
        }}
      />

      {/* UTILITY SCREENS */}
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
