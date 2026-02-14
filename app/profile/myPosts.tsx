import React, { useContext, useEffect, useState } from "react"
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import { AuthContext } from "@/context/AuthContext"
import { getCategoryPostCounts } from "@/services/postService"
import type { Href } from "expo-router"

const categories = [
  { name: "Cars", icon: "🚗", color: "#3b82f6", route: "cars" },
  { name: "Motorbikes", icon: "🏍️", color: "#8b5cf6", route: "motorbikes" },
  { name: "Phones", icon: "📱", color: "#06b6d4", route: "phones" },
  { name: "Arts", icon: "🎨", color: "#f59e0b", route: "arts" },
  { name: "Property", icon: "🏠", color: "#10b981", route: "property" },
]

const MyPosts = () => {
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadCounts()
    }
  }, [user])

  const loadCounts = async () => {
    try {
      const postCounts = await getCategoryPostCounts(user!.uid)
      setCounts(postCounts)
    } catch (error) {
      console.error("Error loading counts:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d1812" }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        colors={["#0d1812", "#0d1812", "#0d1812", "#0d1812"]}
        className="flex-1 px-6 pt-10"
      >
        <Pressable
          onPress={() => router.back()}
          className="border border-white rounded-[60px] px-3 py-5 mb-6"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-2xl font-semibold">
              My Posts
            </Text>
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
              <Feather name="arrow-left" size={26} color="#ffffff" />
            </View>
          </View>
        </Pressable>

        <Text className="text-white font-semibold text-lg mb-3">
          Select Category
        </Text>

        <View className="gap-4 mb-6">
          {categories.map((category) => {
            const count = counts[category.name] || 0
            return (
              <Pressable
                key={category.name}
                onPress={() => router.push(`/profile/posts/${category.route}` as Href)}
                className="bg-white/5 border border-white/10 rounded-3xl p-6"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View 
                      className="w-16 h-16 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Text style={{ fontSize: 32 }}>{category.icon}</Text>
                    </View>
                    <View>
                      <Text className="text-white text-xl font-semibold">
                        {category.name}
                      </Text>
                      <Text className="text-white/50 text-sm">
                        {count} {count === 1 ? 'post' : 'posts'}
                      </Text>
                    </View>
                  </View>
                  <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
                    <Feather name="chevron-right" size={20} color="#10b981" />
                  </View>
                </View>
              </Pressable>
            )
          })}
        </View>
      </LinearGradient>
    </ScrollView>
  )
}

export default MyPosts