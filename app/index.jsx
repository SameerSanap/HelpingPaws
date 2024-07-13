import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import { Redirect, router } from "expo-router";
import { useAuth } from "@/context/authContext";

export default function Index() {
  const { user, login } = useAuth();

  if (login && user) {
    return <Redirect href="/home" />;
  }
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center px-4">
          <Image
            source={require("../assets/images/logo1.png")}
            className="h-80 w-80"
            resizeMode="contain"
          />
          <View className="relative ">
            <Text className="text-2xl text-red-200 font-bold text-center">
              Help Voice less souls
            </Text>
            <Text className="text-pink-300 text-xl ml-12 mt-2 font-psemibold">
              Helping Paws
            </Text>
            <Button
              title="Continue"
              style="mt-5"
              onPress={() => {
                router.push("/signIn");
              }}
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
