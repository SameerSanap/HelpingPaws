import React from "react";
import { View, Text, Image } from "react-native";

const AdoptedList = ({ data }) => {
  return (
    <View className="p-4 bg-[#2c2c3e] rounded-lg mb-4 flex-row shadow-lg shadow-gray-800">
      <Image
        source={{ uri: data.petImageUrl }}
        className="h-20 w-20 rounded-full border-2 border-gray-400"
      />
      <View className="flex-1 justify-center ml-4">
        <Text className="text-white text-lg font-pbold">{data.petName}</Text>
        <Text className="text-gray-300 text-sm mt-1">
          was adopted by{" "}
          <Text className="text-gray-300 font-psemibold">{data.adopter}</Text>
        </Text>
      </View>
    </View>
  );
};

export default AdoptedList;
