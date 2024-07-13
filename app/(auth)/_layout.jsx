import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="signIn" />
        <Stack.Screen name="signUp" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
