import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href="/auth/login" />;
};

export default Index;
