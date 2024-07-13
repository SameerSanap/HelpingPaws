import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { getFoundation } from "../../lib/database";
export default function donation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = usePathname().split("/").pop();
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getFoundation(id);
        setData(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);
  if (loading) {
    return (
      <SafeAreaView className="bg-[#161622] h-full flex justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full bg-primary ">
      <ScrollView>
        <View className="m-6  p-2 justify-center items-center">
          <Image
            source={{ uri: data.ngoImageUrl }}
            className="w-40 h-40 rounded-xl my-4"
          />
          <Text className="text-white font-pmedium text-xl">{data.name}</Text>
        </View>
        <View className="m-2 p-4 space-y-2">
          <Text className="text-xl text-white font-pregular ">
            Owner: {data.founder}
          </Text>
          <Text className="text-lg text-white font-pregular ">
            Address: {data.address}
          </Text>
        </View>
        <View className="w-full p-3">
          <Text className="text-center text-gray-500 text-lg font-psemibold">
            {data.motive}
          </Text>
        </View>
        <View className="p-2 justify-center items-center space-y-4 mb-5">
          <Text className="text-white text-lg font-pregular text-center">
            Help them with some ammount
          </Text>
          <Text className="text-white text-xl font-pbold">
            UPI id: {data.upi}
          </Text>
          <Text className="text-white text-lg font-pbold">QR code</Text>
          <Image
            source={{ uri: data.qrImageUrl }}
            className="h-60 w-60 rounded-2xl bg-white "
          />
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
