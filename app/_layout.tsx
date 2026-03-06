import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,     
          contentStyle: { backgroundColor: "#f5f5f5" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="create-account" />
        <Stack.Screen name="forget-password" />
      </Stack>
    </>
  );
}
