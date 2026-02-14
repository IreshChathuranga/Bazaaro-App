import React, { useContext, useEffect, useState } from "react"
import { View, Text, Pressable, ScrollView, Image, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import { AuthContext } from "@/context/AuthContext"
import { getUserPostsByCategory, deletePost } from "@/services/postService"
import Toast from "react-native-toast-message"
import type { Href } from "expo-router"

const CarsPostsList = () => {
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadPosts()
    }
  }, [user])

  const loadPosts = async () => {
    try {
      const userPosts = await getUserPostsByCategory(user!.uid, "Cars")
      setPosts(userPosts)
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId)
      Toast.show({
        type: "success",
        text1: "Deleted",
        text2: "Post deleted successfully",
        position: "top",
        visibilityTime: 2000,
      })
      loadPosts()
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not delete post",
        position: "top",
        visibilityTime: 3000,
      })
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
          onPress={() => router.replace("/tabs/profile")}
          className="border border-white rounded-[60px] px-3 py-5 mb-6"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-2xl font-semibold">
              My Cars 🚗
            </Text>
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
              <Feather name="arrow-left" size={26} color="#ffffff" />
            </View>
          </View>
        </Pressable>

        {posts.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Text className="text-white/50 text-lg">No posts yet</Text>
          </View>
        ) : (
          <View className="gap-4 mb-10">
            {posts.map((post) => (
              <View key={post.id} className="bg-white/5 border border-white/10 rounded-3xl p-4">
                <View className="flex-row">
                  {post.images && post.images[0] && (
                    <Image
                      source={{ uri: post.images[0] }}
                      style={{ width: 100, height: 100, borderRadius: 12, marginRight: 12 }}
                    />
                  )}
                  <View className="flex-1">
                    <Text className="text-white text-lg font-semibold mb-1">
                      {post.title}
                    </Text>
                    <Text className="text-green-500 text-base font-bold mb-2">
                      LKR {post.price?.toLocaleString()}
                    </Text>
                    <Text className="text-white/50 text-sm">
                      {post.brand} • {post.year}
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-2 mt-3">
                  <Pressable
                    onPress={() => router.push(`/profile/edit/${post.id}` as Href)}
                    className="flex-1 bg-green-500 py-3 rounded-2xl"
                  >
                    <Text className="text-white text-center font-semibold">Edit</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(post.id)}
                    className="flex-1 bg-red-500 py-3 rounded-2xl"
                  >
                    <Text className="text-white text-center font-semibold">Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </LinearGradient>
    </ScrollView>
  )
}

export default CarsPostsList