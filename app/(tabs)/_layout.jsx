import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import icons from "../../constants/icons";

function TabIcon({ color, focused, name, icon, imageS }) {
  return (
    <View className={`justify-center items-center gap-1 `}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className={`w-6 h-6  ${imageS} mr-1`}
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
            tabBarActiveTintColor: "#ffffff",
            tabBarInactiveTintColor: "#e03157",
            tabBarStyle: {
              backgroundColor: "#fcfcfc",
              backgroundColor: "#212139",
              borderTopStartRadius: 50,
              borderTopEndRadius: 50,
              height: 70,
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.home}
                  color={color}
                  name="Home"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="Pets"
            options={{
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.pet}
                  color={color}
                  name="Pets"
                  focused={focused}
                />
              ),
            }}
          />
          {/* <Tabs.Screen
            name="add"
            options={{
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <AddTabIcon color={color} focused={focused} />
              ),
            }}
          /> */}
          <Tabs.Screen
            name="add"
            options={{
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.plus}
                  color={color}
                  name="Add"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="donate"
            options={{
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.donate}
                  color={color}
                  name="Donate"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.profile}
                  color={color}
                  name="Profile"
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
