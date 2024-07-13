import { View, Image, TouchableOpacity, Text } from "react-native";
import React from "react";
import icons from "../constants/icons";
import { router } from "expo-router";

export default function UserList({ data }) {
  function goToChat(id) {
    router.push(`/chat/${id}`);
  }

  return (
    <TouchableOpacity
      className="mx-3 my-5 flex-row items-center"
      onPress={() => goToChat(data.item?.userId)}
    >
      <Image
        source={
          data.item?.profileUrl ? { uri: data.item.profileUrl } : icons.user
        }
        className="h-12 w-12 rounded-full"
      />
      <Text className="text-white mx-4 my-3 text-lg font-pregular flex-grow">
        {data.item?.username}
      </Text>
      <View className="flex-row justify-end">
        <Image source={icons.rightArrow} className="h-3 w-4" />
      </View>
    </TouchableOpacity>
  );
}
