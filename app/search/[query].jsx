import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Search from "../../components/Search";
import { getByName } from "../../lib/database";
import PetList from "../../components/PetList";
import UserList from "../../components/UserList";

const SearchPage = () => {
  const { query, dbName, fieldName } = useLocalSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const refetch = async () => {
    if (query) {
      setLoading(true);
      try {
        const pets = await getByName(query, fieldName, dbName);
        setResults(pets);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [query, dbName, fieldName]);

  return (
    <KeyboardAvoidingView>
      <SafeAreaView className="bg-primary h-full">
        <FlatList
          ListHeaderComponent={() => (
            <>
              <View className="flex my-6 px-4">
                <Text className="font-pmedium text-gray-100 text-sm">
                  Search Results
                </Text>
                <Text className="text-2xl font-psemibold text-white mt-1">
                  {query}
                </Text>

                <View className="mt-6 mb-8">
                  <Search
                    initialQuery={query}
                    refetch={refetch}
                    dbName={dbName}
                    fieldName={fieldName}
                  />
                </View>
              </View>
            </>
          )}
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            dbName === "posts" ? (
              <PetList item={item} />
            ) : (
              <UserList data={item} />
            )
          }
          ListFooterComponent={() =>
            loading ? <ActivityIndicator size="large" color="#FFF" /> : null
          }
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SearchPage;
