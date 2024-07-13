import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../context/authContext";
import { StatusBar } from "expo-status-bar";

export default function CommunityChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user, currentUser } = useAuth();
  const flatListRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "global"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messages);
    });
    return () => unsubscribe();
  }, []);

  useLayoutEffect(() => {
    if (messages.length > 0) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      await addDoc(collection(db, "global"), {
        text: newMessage.trim(),
        createdAt: new Date(),
        userId: user.uid,
        userName: currentUser ? currentUser.username : "User",
      });
      setNewMessage("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary p-2">
      <View>
        <Text className="text-center text-2xl font-pmedium text-white mb-4">
          Community Chat
        </Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className={`p-3 m-2 rounded-xl ${
              item.userId === user.uid
                ? "bg-secondary-100 self-end"
                : "bg-black-200 self-start"
            } max-w-3/4`}
          >
            <Text className="font-bold text-white pb-2">{item.userName}</Text>
            <Text className="text-white font-pregular">{item.text}</Text>
            <Text className="text-xs text-gray-400 mt-1">
              {new Date(item.createdAt.seconds * 1000).toLocaleTimeString()}
            </Text>
          </View>
        )}
        inverted
      />
      <View className="flex-row p-2 border-t border-gray-300 m-2">
        <TextInput
          className="flex-1 p-3 border border-gray-300 rounded-lg bg-white"
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="justify-center items-center p-3 bg-secondary-100 rounded-lg ml-3"
        >
          <Text className="text-white font-pmedium">Send</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
