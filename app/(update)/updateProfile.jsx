import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { storage, db } from "../../firebaseConfig";
import { useAuth } from "../../context/authContext";
import icons from "../../constants/icons";

export default function UpdateProfile() {
  const [form, setForm] = useState({
    profile: null,
    phoneNo: "",
    address: "",
    city: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  function handleBack() {
    router.back();
  }

  const openPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setForm({ ...form, profile: result.assets[0] });
    }
  };

  const uploadImage = async (uri, userId) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const storageRef = ref(storage, `images/${userId}/profile/${filename}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("You must be logged in to submit.");
      return;
    }
    const { profile, phoneNo, email, address, city } = form;
    if (!profile || !phoneNo || !email || !address || !city) {
      Alert.alert("Error", "Fill All Details");
      return;
    }

    setIsSubmitting(true);

    try {
      const profileUrl = form.profile
        ? await uploadImage(form.profile.uri, user.uid)
        : null;
      const formData = {
        phoneNo,
        email,
        address,
        city,
        profileUrl,
        updatedAt: new Date(),
      };

      // Update Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, formData, { merge: true });
      Alert.alert("Success", "Profile updated successfully!");
      router.push("/profile");
    } catch (error) {
      console.error("Error updating profile: ", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary">
      <ScrollView className="m-2 p-3">
        <View className="flex-row flex-1">
          <Ionicons
            name="arrow-back"
            size={25}
            color="#fff"
            onPress={handleBack}
          />
          <Text className="text-white text-center text-2xl font-pmedium mx-3">
            Update Profile
          </Text>
        </View>

        <View className="my-2 justify-center items-center">
          <Image
            source={form.profile?.uri ? { uri: form.profile.uri } : icons.user}
            className="h-32 w-32 rounded-full"
          />

          <TouchableOpacity onPress={openPicker}>
            <Image
              source={icons.add}
              className="w-5 h-5 mt-3"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <FormField
          title="Phone No."
          value={form.phoneNo}
          placeholder="mobile"
          handleChange={(e) => setForm({ ...form, phoneNo: e })}
          style="mt-7"
        />
        <FormField
          title="Email"
          value={form.email}
          placeholder="sam@gmail.com"
          handleChange={(e) => setForm({ ...form, email: e })}
          style="mt-7"
        />
        <FormField
          title="City"
          value={form.city}
          placeholder="City"
          handleChange={(e) => setForm({ ...form, city: e })}
          style="mt-7"
        />
        <FormField
          title="Address"
          value={form.address}
          placeholder="Full address"
          handleChange={(e) => setForm({ ...form, address: e })}
          style="mt-7"
        />
        <Button
          title="Save"
          style="m-4"
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
