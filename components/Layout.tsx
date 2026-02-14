'use client';

import { useRouter, type Href } from "expo-router";
import React, { ReactNode, useState } from "react";
import { Pressable, Text, View, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LayoutProps = {
  children?: ReactNode;
  showTabBar?: boolean;
};

const Layout = ({ children, showTabBar = true }: LayoutProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");

  const navigate = (tab: string, path: Href) => {
    setActiveTab(tab);
    router.push(path);
  };

  return (
    <SafeAreaView className="flex-1 bg-white/5" edges={['top']}>
      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: showTabBar ? 90 : 20,
          flexGrow: 1
        }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {/* Bottom Navigation */}
      {showTabBar && (
        <View
          className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center bg-[#0a110d] border-t border-white/10"
          style={{
            paddingVertical: 8,
            paddingBottom: Platform.OS === "ios" ? 20 : 8,
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,

            // 👇 Me deka add karanna
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
        >
          <Pressable
            className="items-center px-3 py-2"
            onPress={() => navigate("home", "/tabs/dashboard")}
          >
            <Text className="text-2xl mb-1">🏠</Text>
            <Text className={`text-[10px] font-medium ${activeTab === "home" ? "text-green-500" : "text-white/50"}`}>
              Home
            </Text>
          </Pressable>

          <Pressable
            className="items-center px-3 py-2"
            onPress={() => navigate("search", "/tabs/search")}
          >
            <Text className="text-2xl mb-1">🔍</Text>
            <Text className={`text-[10px] font-medium ${activeTab === "search" ? "text-green-500" : "text-white/50"}`}>
              Search
            </Text>
          </Pressable>

          <Pressable
            className="items-center justify-center -mt-6"
            onPress={() => navigate("post", "/tabs/post")}
          >
            <View className="w-14 h-14 bg-green-500 rounded-full items-center justify-center mb-1 shadow-lg">
              <Text className="text-white text-3xl font-bold" style={{ lineHeight: 56 }}>+</Text>
            </View>
            <Text className={`text-[10px] font-medium ${activeTab === "post" ? "text-green-500" : "text-white/50"}`}>
              Post
            </Text>
          </Pressable>

          <Pressable
            className="items-center px-3 py-2"
            onPress={() => navigate("chat", "/tabs/chat")}
          >
            <Text className="text-2xl mb-1">💬</Text>
            <Text className={`text-[10px] font-medium ${activeTab === "chat" ? "text-green-500" : "text-white/50"}`}>
              Chat
            </Text>
          </Pressable>

          <Pressable
            className="items-center px-3 py-2"
            onPress={() => navigate("account", "/tabs/profile")}
          >
            <Text className="text-2xl mb-1">👤</Text>
            <Text className={`text-[10px] font-medium ${activeTab === "account" ? "text-green-500" : "text-white/50"}`}>
              Account
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Layout;