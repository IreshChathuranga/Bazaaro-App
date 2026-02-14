import React from "react";
import Layout from "@/components/Layout";
import { View, Text } from "react-native";

const Chat = () => {
  return (
    <Layout>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chat Page</Text>
      </View>
    </Layout>
  );
};

export default Chat;
