import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import icons from "../../constants/icons";
import { router } from "expo-router";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import { useAuth } from "../../context/authContext";
import { db, storage } from "../../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function RegisterNgo() {
  const { user } = useAuth();
  const initialState = {
    name: "",
    founder: "",
    address: "",
    motive: "",
    upi: "",
    ngoImage: null,
    qr: null,
  };
  const [form, setForm] = useState(initialState);

  function handleBack() {
    router.back();
  }

  async function openPicker(type) {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.6,
    });
    if (!result.canceled) {
      if (type === "qr") {
        setForm({ ...form, qr: result.assets[0] });
      } else if (type === "ngo") {
        setForm({ ...form, ngoImage: result.assets[0] });
      }
    }
  }

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
    const { name, address, upi, qr, ngoImage, founder, motive } = form;

    if (!user) {
      Alert.alert("You must be logged in to submit.");
      return;
    }

    if (!name || !address || !upi || !qr || !ngoImage || !founder || !motive) {
      Alert.alert("Error", "Fill All Details");
      return;
    }

    try {
      const ngoImageUrl = ngoImage
        ? await uploadImage(ngoImage.uri, user.uid, "ngo")
        : null;
      const qrImageUrl = qr ? await uploadImage(qr.uri, user.uid, "qr") : null;

      const formData = {
        ...form,
        ngoImageUrl,
        qrImageUrl,
        userId: user.uid,
        timestamp: new Date(),
      };

      await addDoc(collection(db, "donation"), formData);
      setForm(initialState);
      Alert.alert("Success", "Ngo successfully!");
      router.push("/donate");
    } catch (error) {
      console.error("Error while adding: ", error);
      Alert.alert("Error", "Failed to Add information.");
    }
  };
  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView className="m-6 p-2">
        <View className="justify-between flex-row ">
          <TouchableOpacity onPress={handleBack}>
            <Image source={icons.leftArrow} className="w-5 h-3 mt-2" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-psemibold text-center">
            Register Your NGO/ Foundation
          </Text>
        </View>
        <FormField
          title="Foundation Name"
          value={form.name}
          handleChange={(e) => setForm({ ...form, name: e })}
          placeholder="NGO name"
          style="mt-10"
        />
        <FormField
          title="Foundation Address"
          value={form.address}
          handleChange={(e) => setForm({ ...form, address: e })}
          placeholder="address"
          style="mt-10"
        />
        <FormField
          title="Founder Name"
          value={form.founder}
          handleChange={(e) => setForm({ ...form, founder: e })}
          placeholder="founder name"
          style="mt-10"
        />
        <FormField
          title="Motive of organisation"
          value={form.motive}
          handleChange={(e) => setForm({ ...form, motive: e })}
          placeholder="motive"
          style="mt-10"
        />
        <FormField
          title="UPI number"
          form={form.upi}
          handleChange={(e) => setForm({ ...form, upi: e })}
          placeholder="UPI id"
          style="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-2xl text-white font-fsemibold">NGO Image</Text>
          <TouchableOpacity onPress={() => openPicker("ngo")}>
            {form.ngoImage ? (
              <Image
                source={{ uri: form.ngoImage.uri }}
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
          <Text className="text-xl text-white font-fsemibold">
            Upload QR code
          </Text>
          <TouchableOpacity onPress={() => openPicker("qr")}>
            {form.qr ? (
              <Image
                source={{ uri: form.qr.uri }}
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
        <Button title="Submit" style="m-5 " onPress={handleSubmit} />
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
