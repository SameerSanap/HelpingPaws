import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import icons from "../../constants/icons";

function TabIcon({ color, focused, name, icon }) {
  return (
    <View className={`justify-center items-center gap-1 `}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className={`w-6 h-6 mr-1`}
      />
      <Text
        className={`${focused ? "font-pbold" : "font-pregular"} `}
        style={{ color: "white" }}
      >
        {name}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#161622" }}>
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#e03157",
            tabBarInactiveTintColor: "#ffffff",
            tabBarStyle: {
              backgroundColor: "#fcfcfc",
              backgroundColor: "#212139",
              borderTopStartRadius: 50,
              borderTopEndRadius: 50,
              height: 60,
            },
          }}
        >
          <Tabs.Screen
            name="chat"
            options={{
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.chat1}
                  color={color}
                  name="Chats"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="Communitychat"
            options={{
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.globe}
                  color={color}
                  name="Community"
                  focused={focused}
                />
              ),
            }}
          />
        </Tabs>
      </View>
      <StatusBar style="light" />
    </>
  );
}
