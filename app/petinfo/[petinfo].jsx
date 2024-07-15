import { router, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import icons from "../../constants/icons";
import { useAuth } from "../../context/authContext";
import { db, storage } from "../../firebaseConfig";
import { deletePostAndImages, getPost, getUser } from "../../lib/database";

export default function PetInfo() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const { user } = useAuth();
  const [detail, setDetail] = useState(null);
  const [adopter, setAdopter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // get Details
  useEffect(() => {
    async function getData() {
      try {
        const res = await getPost(id);
        setDetail(res);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [id]);

  // Delete Post
  const ownerUri = detail?.ownerImage.uri.split("/").pop();
  const petUri = detail?.petImage.uri.split("/").pop();

  const handleDelete = async () => {
    try {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this post?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              setLoading(true);
              await deletePostAndImages(id, ownerUri, petUri);
              setLoading(false);
              router.push("/home");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting post: ", error);
      setLoading(false);
    }
  };

  // Add to adopter list if adopted this pet
  useEffect(() => {
    async function getData() {
      try {
        const res = await getUser(user?.uid);
        setAdopter(res);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [user?.uid]);

  const uploadImage = async (uri) => {
    try {
      console.log("Starting image upload...");
      console.log("URI:", uri);

      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await response.blob();
      console.log("Image converted to blob");

      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const storageRef = ref(storage, `adopted/${filename}`);
      await uploadBytes(storageRef, blob);
      console.log("Image uploaded to Firebase Storage");

      const downloadURL = await getDownloadURL(storageRef);
      console.log("Image uploaded successfully. URL:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleAdopt = async () => {
    try {
      Alert.alert(
        "Confirm Adopt",
        "Are you sure you want to Adopt this Pet? Pet will get removed from this page once confirmed",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Adopt",
            style: "destructive",
            onPress: async () => {
              try {
                setLoading(true);
                console.log("Adopt process started");

                // Upload new pet image and get its URL
                const newPetImageUrl = detail.petImage
                  ? await uploadImage(detail.petImage.uri)
                  : null;

                console.log("New pet image URL:", newPetImageUrl);

                const adoptedPetData = {
                  ...detail,
                  petImageUrl: newPetImageUrl,
                  adopter: adopter.username,
                };

                // Set the document in the "adopted" collection
                await addDoc(collection(db, "adopted"), adoptedPetData);
                console.log("Adopted pet data saved to Firestore");

                Alert.alert("Success", "Adopted!");

                // Delete the original post and image
                // await deletePostAndImages(id, ownerUri, petUri);
                console.log("Original post and images deleted");
                setLoading(false);

                router.push("/home");
              } catch (error) {
                console.error("Error adopting pet (inner catch):", error);
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error adopting pet (outer catch):", error);
      setLoading(false);
    }
  };

  // Go to Chat screen
  function goToChat(id) {
    router.push(`/chat/${id}`);
  }

  if (loading) {
    return (
      <SafeAreaView className="bg-[#161622] h-full flex justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  if (error || !detail) {
    return (
      <SafeAreaView className="bg-[#161622] h-full flex justify-center items-center">
        <Text className="text-white">Failed to load data.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-[#161622] h-full">
      <ScrollView className="mt-5 p-4 mb-3">
        <View className="space-y-1 justify-center items-center">
          <View>
            <Image
              source={{ uri: detail.petImageUrl }}
              className="h-80 w-80 rounded-2xl"
            />
            <View className="justify-between flex-row">
              <Text className="text-2xl text-white font-psemibold my-3">
                {detail.petName}
              </Text>
              {user.uid === detail.userId && (
                <TouchableOpacity onPress={handleDelete}>
                  <Image source={icons.bin} className="h-8 w-8 my-3" />
                </TouchableOpacity>
              )}
            </View>
            <View className="flex-row gap-2">
              <Image source={icons.location} className="w-4 h-4" />
              <Text className="text-md font-plight text-white">
                {detail.location}
              </Text>
            </View>
          </View>
          <View className="justify-between flex-row gap-6">
            <View className="bg-[#532e1a] w-28 h-24 rounded-2xl justify-center items-center">
              <Text className="text-gray-200 font-pregular">Gender</Text>
              <Text className="text-white font-psemibold">{detail.gender}</Text>
            </View>
            <View className="bg-[#134e4a] w-28 h-24 rounded-2xl justify-center items-center">
              <Text className="text-gray-200 font-pregular">Age</Text>
              <Text className="text-white font-psemibold">{detail.age}</Text>
            </View>
            <View className="bg-[#075985] w-28 h-24 rounded-2xl justify-center items-center">
              <Text className="text-gray-200 font-pregular">Breed</Text>
              <Text className="text-white font-psemibold">{detail.breed}</Text>
            </View>
          </View>
        </View>
        <View className="flex-row gap-3 my-5">
          <Image
            source={{ uri: detail.ownerImageUrl }}
            className="h-20 w-20 rounded-full"
          />
          <View className="flex-col m-2">
            <Text className="text-lg text-white font-psemibold">
              {detail.ownerName}
            </Text>
            <Text className="text-md text-white font-plight">
              {detail.location}
            </Text>
          </View>
        </View>
        <View className="mt-3">
          <Text className="text-lg text-gray-400 font-pregular">
            About {detail.name}
          </Text>
          <Text className="text-white text-sm font-plight">{detail.about}</Text>
        </View>
        <View className="mt-5">
          <Text className="text-lg text-gray-400 font-pregular">Address</Text>
          <Text className="text-white text-sm font-plight">
            {detail.address}
          </Text>
        </View>
        <View className="flex-row my-6 justify-center">
          {user.uid !== detail.userId ? (
            <>
              <TouchableOpacity onPress={() => goToChat(detail.userId)}>
                <Image
                  source={icons.chat1}
                  className="w-9 h-9 m-auto p-4 mr-3"
                />
              </TouchableOpacity>
              <Button title="Adopt" style="flex-1" onPress={handleAdopt} />
            </>
          ) : (
            <Text className="text-gray-600 text-xl font-pregular text-center">
              Your Post
            </Text>
          )}
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
