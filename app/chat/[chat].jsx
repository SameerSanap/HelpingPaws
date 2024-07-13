import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { usePathname } from "expo-router";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "../../context/authContext";
import { getUser } from "../../lib/database";
import icons from "../../constants/icons";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [receiver, setReciver] = useState();
  const [message, setMessage] = useState("");
  const receiverId = usePathname().split("/").pop();
  const { user } = useAuth();

  const chatId = [user.uid, receiverId].sort().join("_"); // Create a unique chat ID
  // get user
  useEffect(() => {
    async function fetchaData() {
      const res = await getUser(receiverId);
      setReciver(res);
    }
    fetchaData();
  }, []);

  // Realtime chat
  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = [];
      snapshot.forEach((doc) => {
        messagesData.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: message,
        createdAt: new Date(),
        user: user.uid,
      });
      setMessage("");
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-primary p-2">
      <View className="justify-center items-center my-7">
        <Image
          source={
            receiver?.profileUrl ? { uri: receiver?.profileUrl } : icons.user
          }
          className="h-36 w-36 rounded-full"
        />
        <Text className="text-xl text-white font-pmedium">
          {receiver?.username}
        </Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className={`m-2 p-3 rounded-lg ${
              item.user === user.uid
                ? "bg-secondary-100 self-end"
                : "bg-gray-700 self-start"
            }`}
          >
            <Text className="text-white font-pregular">{item.text}</Text>
            <Text className="text-xs text-white mt-1 ">
              {new Date(item.createdAt.seconds * 1000).toLocaleTimeString()}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View className="flex-row p-4">
        <TextInput
          className="flex-1 border bg-white border-gray-300 p-3 rounded-lg"
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="ml-2 justify-center bg-secondary-100 p-3 rounded-lg"
        >
          <Text className="text-white font-bold">Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
