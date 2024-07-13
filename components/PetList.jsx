import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import icons from "../constants/icons";
import { router } from "expo-router";

function List({ item }) {
  function hanldePress(id) {
    router.push(`/petinfo/${id}`);
  }
 
  return (
    <ScrollView>
      <TouchableOpacity onPress={() => hanldePress(item.id)}>
        <View className="flex-row flex-1 m-2 p-4 pb-5">
          <Image
            source={{ uri: item.petImageUrl }}
            className="h-40 w-40 rounded-xl"
          />
          <View className="ml-4 mt-2 ">
            <View className="flex-row gap-3 py-2">
              <Image source={icons.paws} className="h-5 w-5 " />
              <Text className="text-xl text-white font-psemibold ">
                {item.petName}
              </Text>
            </View>
            <View className="flex-row py-2">
              <Image source={icons.location} className="h-5 w-5 " />
              <Text className="text-md text-white font-plight ml-3">
                {item.location}
              </Text>
            </View>

            <Text className="text-lg text-white font-pextralight">
              {item.age}
            </Text>
            <View className="flex-row py-2">
              <Image source={icons.owner} className="h-5 w-5 " />
              <Text className="text-lg text-white font-pregular ml-3">
                {item.ownerName}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default function PetList({ item }) {
  return (
    <FlatList
      data={[item]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <List item={item} />}
    />
  );
}
