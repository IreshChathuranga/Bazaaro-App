'use client';

import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, Text, View } from "react-native";

type Product = {
  id: number
  title: string
  price: string
  image: string
  category: string
  location: string
  isFavorite: boolean
}

const Home = () => {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")

  // Mock product data
  const products: Product[] = [
    {
      id: 1,
      title: "Ashok Leyland Tusker Super 1618 2017",
      price: "11,115,000",
      image: "https://via.placeholder.com/200x200?text=Vehicle",
      category: "Vehicles",
      location: "Sri Lanka",
      isFavorite: false,
    },
    {
      id: 2,
      title: "Accounts Assistant (Female)",
      price: "45,000",
      image: "https://via.placeholder.com/200x200?text=Job",
      category: "Jobs",
      location: "Colombo",
      isFavorite: false,
    },
    {
      id: 3,
      title: "POS System Equipment",
      price: "85,000",
      image: "https://via.placeholder.com/200x200?text=Equipment",
      category: "Equipment",
      location: "Kandy",
      isFavorite: false,
    },
    {
      id: 4,
      title: "Mobile Phone",
      price: "35,000",
      image: "https://via.placeholder.com/200x200?text=Mobile",
      category: "Electronics",
      location: "Galle",
      isFavorite: false,
    },
  ]

  const renderProductCard = ({ item }: { item: Product }) => (
    <View className="w-1/2 p-2">
      <Pressable className="bg-white rounded-2xl overflow-hidden">
        <View className="bg-gray-300 h-40 justify-center items-center">
          <Image
            source={{ uri: item.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="p-3 border-b-4 border-yellow-400">
          <Text className="text-sm font-bold text-gray-800 mb-1" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-lg font-bold text-orange-600 mb-2">
            {item.price}
          </Text>
        </View>
        <View className="absolute bottom-24 right-2 bg-red-500 rounded-full w-7 h-7 justify-center items-center">
          <Text className="text-white text-xs font-bold">♥</Text>
        </View>
      </Pressable>
    </View>
  )

  const renderFeaturedSection = () => (
    <View className="mx-2 mb-4 bg-white border-4 border-yellow-400 rounded-lg overflow-hidden">
      <View className="bg-orange-500 px-3 py-1">
        <Text className="text-white font-bold text-sm">FEATURED</Text>
      </View>
      <View className="h-40 bg-gray-300 flex-row">
        <View className="flex-1 justify-center items-center">
          <Image
            source={{ uri: "https://via.placeholder.com/150x150?text=Featured1" }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1 justify-center items-center">
          <Image
            source={{ uri: "https://via.placeholder.com/150x150?text=Featured2" }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  )

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-orange-600 px-4 pt-4 pb-3">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-2">
            <Text className="text-white text-2xl font-bold">🏪 bazaaro</Text>
            <Text className="text-white text-sm font-semibold">245,823 results</Text>
          </View>
          <Pressable>
            <Text className="text-white text-lg">🔖</Text>
          </Pressable>
        </View>

        {/* Filters */}
        <View className="flex-row gap-2 mb-3">
          <Pressable className="flex-1 border-2 border-gray-400 rounded-full px-4 py-2 flex-row items-center justify-between">
            <Text className="text-gray-800 font-semibold">All of Sri Lanka</Text>
            <Text>▼</Text>
          </Pressable>
          <Pressable className="border-2 border-gray-400 rounded-full px-4 py-2">
            <Text className="text-gray-800 font-semibold">▼</Text>
          </Pressable>
        </View>

        {/* Search/Filter Bar */}
        <View className="flex-row gap-2">
          <Pressable className="flex-1 bg-green-100 border-2 border-green-400 rounded-full px-4 py-2">
            <Text className="text-green-700 text-sm">All posters</Text>
          </Pressable>
          <Pressable className="border-2 border-green-500 rounded-full w-10 h-10 justify-center items-center">
            <Text className="text-green-600 text-lg">⚙</Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        {/* Products Grid */}
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        />

        {/* Featured Section */}
        {renderFeaturedSection()}

        <View className="h-20" />
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="bg-white border-t border-gray-300 flex-row justify-around items-center py-3 absolute bottom-0 left-0 right-0">
        <Pressable
          className="items-center"
          onPress={() => setActiveTab("home")}
        >
          <Text className="text-2xl mb-1">🏠</Text>
          <Text className={activeTab === "home" ? "text-green-600 font-bold text-xs" : "text-gray-600 text-xs"}>
            Home
          </Text>
        </Pressable>

        <Pressable className="items-center" onPress={() => router.push("/tabs/search")}>
          <Text className="text-2xl mb-1">🔍</Text>
          <Text className="text-gray-600 text-xs">Search</Text>
        </Pressable>

        <Pressable className="items-center" onPress={() => router.push("/tabs/post")}>
          <View className="bg-yellow-400 rounded-full w-12 h-12 justify-center items-center mb-1 border-4 border-white shadow-lg">
            <Text className="text-white text-2xl font-bold">+</Text>
          </View>
          <Text className="text-gray-600 text-xs">Post ad</Text>
        </Pressable>

        <Pressable className="items-center" onPress={() => router.push("/tabs/chat")}>
          <Text className="text-2xl mb-1">💬</Text>
          <Text className="text-gray-600 text-xs">Chat</Text>
        </Pressable>

        <Pressable className="items-center" onPress={() => router.push("/tabs/profile")}>
          <Text className="text-2xl mb-1">👤</Text>
          <Text className="text-gray-600 text-xs">Account</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Home
