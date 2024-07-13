import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  FlatList,
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { getFoundations } from "../../lib/database";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import DonationList from "../../components/DonationList";
import icons from "../../constants/icons";
import { router } from "expo-router";

export default function Donate() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await getFoundations();
      setData(res);
      setLoading(false);
    }
    fetchData();

    const unsubscribe = onSnapshot(collection(db, "donation"), (snapshot) => {
      const updatedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(updatedData);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="h-full bg-primary flex justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }
  function handlePress() {
    router.push("/donation/RegisterNgo");
  }
  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DonationList data={item} />}
        ListHeaderComponent={() => (
          <View className="m-5 p-3">
            <Text className="text-white font-pregular text-xl text-center">
              Donate to NGO
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        className=" absolute bottom-5 right-10 before:bg-secondary-100 p-3 rounded-full "
        onPress={handlePress}
      >
        <Image source={icons.add} className="h-10 w-10" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
