import { View, Text, SafeAreaView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { getUsers } from "../../lib/database";
import UserList from "../../components/UserList";
import Search from "../../components/Search";
export default function chat() {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      const data = await getUsers();
      setUsers(data);
    }
    fetchData();
  }, []);
  const res = users.filter((item) => item.userId !== user.uid);

  return (
    <SafeAreaView className="h-full bg-primary p-2">
      <View>
        <Text className="text-2xl text-white font-pregular text-center m-6">
          Chats
        </Text>
        <Search dbName="users" fieldName="username" />
        <FlatList
          data={res}
          keyExtractor={(item) => item.userId}
          renderItem={(item) => <UserList data={item} />}
        />
      </View>
    </SafeAreaView>
  );
}
