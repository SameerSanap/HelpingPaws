import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import icons from "../../constants/icons";
import Button from "../../components/Button";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker
import { useAuth } from "../../context/authContext";
import { router } from "expo-router";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { storage, db } from "../../firebaseConfig";

export default function Create() {
  const initialState = {
    petName: "",
    petImage: null,
    ownerImage: null,
    type: "",
    location: "",
    age: "",
    gender: "",
    breed: "",
    ownerName: "",
    about: "",
    address: "",
    contact: "",
  };
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(initialState);

  // Request media library permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library needed.");
      }
    })();
  }, []);

  const openPicker = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.cancelled) {
      if (type === "pet") {
        setForm({ ...form, petImage: result.assets[0] });
      } else if (type === "owner") {
        setForm({ ...form, ownerImage: result.assets[0] });
      }
    }
  };

  const uploadImage = async (uri, userId, imageType) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const storageRef = ref(
      storage,
      `images/${userId}/${imageType}/${filename}`
    );
    await uploadBytes(storageRef, blob);

    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async () => {
    const {
      petName,
      petImage,
      ownerImage,
      type,
      location,
      age,
      gender,
      breed,
      ownerName,
      about,
      address,
      contact,
    } = form;

    if (!user) {
      Alert.alert("You must be logged in to submit.");
      return;
    }

    if (
      !petName ||
      !petImage ||
      !about ||
      !address ||
      !location ||
      !ownerImage ||
      !ownerName ||
      !age ||
      !breed ||
      !gender ||
      !type ||
      !contact
    ) {
      Alert.alert("Error", "Fill All Details");
      return;
    }

    setIsSubmitting(true);

    try {
      const petImageUrl = petImage
        ? await uploadImage(petImage.uri, user.uid, "pet")
        : null;
      const ownerImageUrl = ownerImage
        ? await uploadImage(ownerImage.uri, user.uid, "owner")
        : null;

      const formData = {
        ...form,
        petImageUrl,
        ownerImageUrl,
        userId: user.uid,
        timestamp: new Date(),
      };

      await addDoc(collection(db, "posts"), formData);
      setForm(initialState);
      Alert.alert("Success", "Pet information uploaded successfully!");
      setIsSubmitting(false);
      router.push("/home");
    } catch (error) {
      console.error("Error uploading pet information: ", error);
      Alert.alert("Error", "Failed to upload pet information.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-fsemibold">
          Upload Pet Information
        </Text>
        <FormField
          title="Pet Name"
          value={form.petName}
          placeholder="Pet Name"
          handleChange={(e) => setForm({ ...form, petName: e })}
          style="mt-10"
        />
        <FormField
          title="Type"
          value={form.type}
          placeholder="Cat, Dog,...etc"
          handleChange={(e) => setForm({ ...form, type: e })}
          style="mt-10"
        />
        <FormField
          title="Location"
          value={form.location}
          placeholder="Mumbai,Delhi"
          handleChange={(e) => setForm({ ...form, location: e })}
          style="mt-10"
        />
        <FormField
          title="Age"
          value={form.age}
          placeholder="age"
          handleChange={(e) => setForm({ ...form, age: e })}
          style="mt-10"
        />
        <FormField
          title="Gender"
          value={form.gender}
          placeholder="Male,Female"
          handleChange={(e) => setForm({ ...form, gender: e })}
          style="mt-10"
        />
        <FormField
          title="Breed"
          value={form.breed}
          placeholder="Indi,..etc"
          handleChange={(e) => setForm({ ...form, breed: e })}
          style="mt-10"
        />
        <FormField
          title="Owner Name"
          value={form.ownerName}
          placeholder="full name"
          handleChange={(e) => setForm({ ...form, ownerName: e })}
          style="mt-10"
        />
        <FormField
          title="Owner Contact No."
          value={form.contact}
          placeholder="contact"
          handleChange={(e) => setForm({ ...form, contact: e })}
          style="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-2xl text-white font-fsemibold">
            Pet's Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("pet")}>
            {form.petImage ? (
              <Image
                source={{ uri: form.petImage.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View
                className="w-full h-16 px-4 bg-black-100 rounded-xl justify-center items-center border-2
              border-black-200 flex-row space-x-2"
              >
                <Image
                  source={icons.upload}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose File
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-2xl text-white font-fsemibold">
            Owner's Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("owner")}>
            {form.ownerImage ? (
              <Image
                source={{ uri: form.ownerImage.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View
                className="w-full h-16 px-4 bg-black-100 rounded-xl justify-center items-center border-2
              border-black-200 flex-row space-x-2"
              >
                <Image
                  source={icons.upload}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose File
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="About"
          value={form.about}
          placeholder="About Pet"
          handleChange={(e) => setForm({ ...form, about: e })}
          style="mt-7"
        />
        <FormField
          title="Address"
          value={form.address}
          placeholder="Full Address please"
          handleChange={(e) => setForm({ ...form, address: e })}
          style="mt-7"
        />
        <Button
          title="Submit"
          style="my-7"
          onPress={handleSubmit}
          disable={isSubmitting}
        />
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
