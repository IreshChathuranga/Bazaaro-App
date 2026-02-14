import React, { useContext, useEffect } from "react"
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import { AuthContext } from "@/context/AuthContext"
import Toast from "react-native-toast-message"

const categories = [
  { id: 1, name: "Cars", icon: "🚗", color: "#3b82f6", route: "cars" },
  { id: 2, name: "Motorbikes", icon: "🏍️", color: "#8b5cf6", route: "motorbikes" },
  { id: 3, name: "Phones", icon: "📱", color: "#06b6d4", route: "phones" },
  { id: 4, name: "Arts", icon: "🎨", color: "#f59e0b", route: "arts" },
  { id: 5, name: "Property", icon: "🏠", color: "#10b981", route: "property" },
]

const Post = () => {
  const router = useRouter()
  const { user, loading } = useContext(AuthContext)

  useEffect(() => {
    if (!loading && !user) {
      Toast.show({
        type: "error",
        text1: "Authentication Required",
        text2: "Please login to post an ad",
        position: "top",
        visibilityTime: 3000,
      })
      setTimeout(() => router.replace("/auth/login"), 500)
    }
  }, [user, loading])

  const handleCategorySelect = (categoryRoute: string) => {
    router.push(`/post/${categoryRoute}` as any)
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d1812" }}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading...</Text>
      </View>
    )
  }

  if (!user) {
    return null
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        colors={["#0d1812", "#0d1812", "#0d1812", "#0d1812"]}
        className="flex-1 px-6 pt-10"
      >
        {/* Header Card */}
        <Pressable
          onPress={() => router.replace("/tabs/dashboard")}
          className="border border-white rounded-[60px] px-3 py-5 mb-6"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-2xl font-semibold">
              Post an Ad
            </Text>
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
              <Feather name="chevron-right" size={26} color="#ffffff" />
            </View>
          </View>
        </Pressable>

        {/* Welcome Section */}
        <View className="mb-6">
          <Text className="text-white text-3xl font-bold mb-2">
            Welcome, {user?.displayName?.split(" ")[0] || "User"}! 👋
          </Text>
          <Text className="text-white/60 text-base">
            Choose an option below to post an ad
          </Text>
        </View>

        {/* Categories Header */}
        <Text className="text-white font-semibold text-lg mb-3">
          Select Category
        </Text>

        {/* Categories Grid */}
        <View className="gap-4 mb-6">
          {categories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => handleCategorySelect(category.route)}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 active:bg-white/10"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View 
                    className="w-16 h-16 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Text style={{ fontSize: 32 }}>{category.icon}</Text>
                  </View>
                  <Text className="text-white text-xl font-semibold">
                    {category.name}
                  </Text>
                </View>
                <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
                  <Feather name="chevron-right" size={20} color="#10b981" />
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Info Card */}
        <View className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 mb-6">
          <View className="flex-row items-start">
            <View className="w-10 h-10 rounded-full bg-green-500/20 items-center justify-center mr-3">
              <Feather name="info" size={20} color="#10b981" />
            </View>
            <View className="flex-1">
              <Text className="text-green-500 font-semibold text-base mb-1">
                Quick Tip
              </Text>
              <Text className="text-white/70 text-sm">
                Select a category that best describes your item to reach the right buyers
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Card */}
        <View className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-10">
          <Text className="text-white font-semibold text-base mb-3">
            Your Posting Stats
          </Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-green-500 text-2xl font-bold">0</Text>
              <Text className="text-white/50 text-xs mt-1">Active Ads</Text>
            </View>
            <View className="w-[1px] bg-white/10" />
            <View className="items-center">
              <Text className="text-green-500 text-2xl font-bold">0</Text>
              <Text className="text-white/50 text-xs mt-1">Views</Text>
            </View>
            <View className="w-[1px] bg-white/10" />
            <View className="items-center">
              <Text className="text-green-500 text-2xl font-bold">0</Text>
              <Text className="text-white/50 text-xs mt-1">Sold</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  )
}

export default Post