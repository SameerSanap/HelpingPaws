import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "../../constants/icons";
import Search from "../../components/Search";
import PetList from "../../components/PetList";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function Pets() {
  const [detail, setDetail] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts"),
      (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDetail(posts);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView className="h-full" style={{ backgroundColor: "#161622" }}>
      <FlatList
        data={detail}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PetList item={item} />}
        ListHeaderComponent={() => (
          <View className=" px-3 space-y-6">
            <View className="flex-row mt-2">
              <Image source={icons.logosm} className="h-16 w-16 mt-3" />
              <View className="flex-1 justify-center items-center">
                <Text className="text-2xl text-white text-center mt-3 font-pbold">
                  Pet's
                </Text>
              </View>
            </View>
            <Search fieldName="petName" dbName="posts" />
            <Text className="text-xl text-gray-500 font-psemibold">Pet's</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
