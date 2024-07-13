import { router } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NewAdded from "../../components/NewAdded";
import icons from "../../constants/icons";
import { db } from "../../firebaseConfig";
import AdoptedList from "../../components/AdoptedList";

export default function Home() {
  const [detail, setDetail] = useState([]);
  const [adopted, setAdopted] = useState([]);

  // get Posts
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts"),
      (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDetail(posts.slice(0, 5));
      },
      (error) => {
        console.log(error);
      }
    );

    return () => unsubscribe();
  }, []);

  // get Adopted
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "adopted"),
      (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAdopted(posts.slice(0, 5));
      },
      (error) => {
        console.log(error);
      }
    );

    return () => unsubscribe();
  }, []);

  function handleChat() {
    router.push("/chat");
  }

  return (
    <SafeAreaView className="h-full bg-primary">
      <View className="px-3 space-y-6">
        <View className="flex-row mt-2">
          <Image source={icons.logosm} className="h-16 w-16 mt-3" />
          <View className="flex-1 justify-center items-center">
            <Text className="text-2xl text-white text-center mt-3 font-pbold">
              Helping Paws
            </Text>
          </View>
          <TouchableOpacity className="mt-7" onPress={handleChat}>
            <Image source={icons.chat} className="h-8 w-8" />
          </TouchableOpacity>
        </View>
        <View>
          <Text className="text-xl text-gray-500 font-psemibold">
            Newly Added Pet's
          </Text>
          <NewAdded posts={detail} />
        </View>
      </View>
      <View className="my-4">
        <Text className="text-xl text-gray-400 text-center font-pregular">
          Recent Adoption
        </Text>
      </View>

      <FlatList
        data={adopted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AdoptedList data={item} />}
      />
    </SafeAreaView>
  );
}
