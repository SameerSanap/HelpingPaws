import { router } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const Button = ({ title, style, onPress,disable }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disable}
      activeOpacity={0.7}
      className={`bg-rose-600 rounded-xl min-h-[62px] flex flex-row justify-center items-center ${style} `}
    >
      <Text className={`text-white font-psemibold text-lg `}>{title}</Text>

      {/* {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )} */}
    </TouchableOpacity>
  );
};

export default Button;
