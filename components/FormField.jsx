import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import icons from "../constants/icons";
export default function FormField({
  title,
  value,
  handleChange,
  placeholder,
  style,
  text,
  ...prop
}) {
  const [showpass, setShowpass] = useState(false);
  return (
    <View className={`space-y-2 ${style}`}>
      <Text
        className={`text-base ${
          text ? "text-black" : "text-white"
        } font-pmedium`}
      >
        {title}
      </Text>
      <View className=" h-16 px-4 border-2 bg-white rounded-2xl flex-row">
        <TextInput
          className="flex-1 text-black"
          value={value}
          placeholderTextColor="gray"
          placeholder={placeholder}
          onChangeText={handleChange}
          secureTextEntry={title === "Password" && !showpass}
          keyboardType={prop.keyboardType}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowpass(!showpass)}>
            <Image
              source={!showpass ? icons.eye : icons.eyeHide}
              className="flex h-10 w-10 mt-2 "
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
