import { View, Text, Image, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { Link } from "expo-router";

import Button from "../../components/Button";
import { Login } from "../../lib/database";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });

  async function logIn() {
    const { email, password } = form;

    if (!email || !password) {
      Alert.alert("Error", "Fill in all fields");
      return;
    }
    try {
      await Login(form);
    } catch (error) {
      Alert.alert("Error", "Failed to Login");
    }
  }

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("../../assets/images/animal.png")}
            className="h-60 w-60"
          />
        </View>
        <View>
          <Text className="text-3xl text-center font-semibold text-blue-500">
            Sign In
          </Text>
        </View>
        <FormField
          title="Email"
          value={form.email}
          handleChange={(e) => setForm({ ...form, email: e })}
          style="mt-7 p-4"
          keyboardType="email-address"
          text="black"
          placeholder="Email"
        />
        <FormField
          title="Password"
          value={form.password}
          handleChange={(e) => setForm({ ...form, password: e })}
          style="p-4"
          placeholder="Password"
          text="black"
          secureTextEntry
        />
        <Button style="m-4" title="Sign In" onPress={logIn} />
        <View>
          <Text className="text-lg font-regular text-center">
            Don't have an account ?
            <Link href="/signUp" className="underline text-blue-500">
              Register
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
