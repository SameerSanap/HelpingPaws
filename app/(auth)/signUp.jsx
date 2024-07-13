import { View, Text, Image, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import { Register } from "../../lib/database";
import { Link } from "expo-router";

export default function SignUp() {
  const [form, setForm] = useState({ email: "", password: "", username: "" });

  async function register() {
    try {
      await Register(form);
      Alert.alert("Success", "You are registered successfully");
    } catch (error) {
      // Handle the error message correctly
      const errorMessage = error.message || "An unknown error occurred";
      Alert.alert("Error", errorMessage);
    }
  }

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("../../assets/images/animal.png")}
            className="h-40 w-40"
          />
        </View>
        <View>
          <Text className="text-3xl text-center font-psemibold text-blue-500">
            Register
          </Text>
        </View>
        <FormField
          title="Username"
          value={form.username}
          handleChange={(e) => setForm({ ...form, username: e })}
          style="p-4"
          text="black"
          placeholder="username"
        />
        <FormField
          title="Email"
          value={form.email}
          handleChange={(e) => setForm({ ...form, email: e })}
          style="p-4"
          text="black"
          keyboardType="email-address"
          placeholder="Email"
        />
        <FormField
          title="Password"
          value={form.password}
          handleChange={(e) => setForm({ ...form, password: e })}
          style="p-4"
          text="black"
          placeholder="Password"
        />

        <Button style="m-4" title="Register" onPress={register} />

        <View>
          <Text className="text-lg font-pregular text-center">
            Already have an account?
            <Link href="/signIn" className="underline text-red-500">
              Login
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
