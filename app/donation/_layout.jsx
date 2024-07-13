import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function DonationLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="[donation]" />
        <Stack.Screen name="RegisterNgo" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
