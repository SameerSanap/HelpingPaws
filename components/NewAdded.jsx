import { useState, useRef } from "react";
import * as Animatable from "react-native-animatable";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

const zoomIn = {
  0: {
    scale: 0.6,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.6,
  },
};

const TrendingItem = ({ activeItem, item }) => {
  function handlePress(id) {
    router.push(`/petinfo/${id}`);
  }
  return (
    <Animatable.View
      className="mr-3"
      animation={activeItem === item.id ? zoomIn : zoomOut}
      duration={700}
    >
      <TouchableOpacity
        className="relative flex justify-center items-center"
        activeOpacity={0.7}
        onPress={() => handlePress(item.id)}
      >
        <Image
          source={{ uri: item.petImageUrl }}
          className="w-52 h-60 rounded-[33px] mt-5 overflow-hidden shadow-lg shadow-black/40"
          resizeMode="cover"
        />
        <View>
          <Text className="text-lg text-white font-pregular mt-2">
            {item.petName}
          </Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const NewAdded = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(
    posts.length > 0 ? posts[0].id : null
  );
  const flatListRef = useRef(null);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].item.id);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 70,
  };

  return (
    <FlatList
      ref={flatListRef}
      data={posts}
      horizontal
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      contentOffset={{ x: 170 }}
    />
  );
};

export default NewAdded;
