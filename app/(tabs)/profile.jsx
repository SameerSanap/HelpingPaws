import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import icons from "../../constants/icons";
import { signOut } from "firebase/auth";
import { router } from "expo-router";
import { auth } from "../../firebaseConfig";
// import { data } from "../../lib/demoData";
import { useAuth } from "../../context/authContext";
import { useEffect, useState } from "react";
import { getUser } from "../../lib/database";

export default function Profile() {
  const { setUser, setLogin, user, setCurrentUser } = useAuth();
  const [data, setData] = useState(null);

  async function handleLogout() {
    try {
      await signOut(auth);
      setUser(null);
      setLogin(false);
      setCurrentUser(null);
      router.replace("/signIn");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  function handleUpdate() {
    router.push("/updateProfile");
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUser(user.uid);
        setData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <FlatList
      ListHeaderComponent={
        <SafeAreaView className="bg-[#161622] h-screen">
          <ScrollView className="m-4 p-2">
            <View className="flex-1 flex-row justify-between">
              <TouchableOpacity onPress={handleUpdate}>
                <Image source={icons.upload} className="w-8 h-8" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <Image source={icons.logout} className="w-8 h-8 " />
              </TouchableOpacity>
            </View>

            <View className="justify-center items-center">
              <Image
                source={
                  data?.profileUrl ? { uri: data?.profileUrl } : icons.user
                }
                className="h-32 w-32 rounded-full"
              />

              <Text className="text-white font-pextrabold text-xl mt-2">
                {data?.username}
              </Text>
              <View className="h-36 w-full bg-[#1a1a2e] mt-6 rounded-lg">
                <View className="flex-row gap-3 ml-2 mt-1">
                  <Image source={icons.location} className="w-5 h-5" />
                  <Text className="text-white font-pextralight text-lg">
                    {data?.city}
                  </Text>
                </View>
                <View className="flex-row gap-3 m-1">
                  <Image source={icons.phone} className="w-5 h-5" />
                  <Text className="text-white font-pextralight text-lg">
                    {data?.phoneNo}
                  </Text>
                </View>
                <View className="flex-row gap-3 m-1">
                  <Image source={icons.mail} className="w-5 h-5" />
                  <Text className="text-white font-pextralight text-lg">
                    {data?.email}
                  </Text>
                </View>
              </View>
            </View>
            <View className="mt-2">
              <Text className="my-3 text-xl text-gray-400">Address</Text>
              <Text className="text-white font-pregular">{data?.address}</Text>
            </View>
            <View>
              <Text className="text-xl text-gray-400 font-pregular my-3">
                Post History
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      }
    />
  );
}
