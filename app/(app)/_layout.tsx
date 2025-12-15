import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";

import { useAuthSession } from "@/providers/authctx";
import { Text, View } from "react-native";
import { useI18n } from "@/hooks/useI18n";

export default function RootLayout() {
  const { user, isLoading } = useAuthSession();
  const { t } = useI18n();

  if (isLoading) {
    return (
      <View>
        <Text>{t("loadingUser")}</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href={"/authentication"} />;
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
