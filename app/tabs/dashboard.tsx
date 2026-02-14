import React, { useState, useEffect, useContext } from "react"
import { View, Text, Image, Pressable, ScrollView, ActivityIndicator, RefreshControl } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import Layout from "@/components/Layout"
import { getAllPosts, getPostsByCategory } from "@/services/postService"
import type { PostWithId } from "@/services/postService"
import { AuthContext } from "@/context/AuthContext"

const categories = [
  { name: "All", icon: "📦" },
  { name: "Cars", icon: "🚗" },
  { name: "Motorbikes", icon: "🏍️" },
  { name: "Phones", icon: "📱" },
  { name: "Arts", icon: "🎨" },
  { name: "Property", icon: "🏠" },
]

const Dashboard = () => {
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const [posts, setPosts] = useState<PostWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    loadPosts()
  }, [selectedCategory])

  const loadPosts = async () => {
    try {
      setLoading(true)
      let fetchedPosts: PostWithId[]
      
      if (selectedCategory === "All") {
        fetchedPosts = await getAllPosts()
      } else {
        fetchedPosts = await getPostsByCategory(selectedCategory)
      }
      
      setPosts(fetchedPosts)
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadPosts()
    setRefreshing(false)
  }

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category)
  }

  const handlePostPress = (postId: string) => {
  router.push(`/post-detail/${postId}` as any)
}

  return (
    <Layout showTabBar={true}>
      <LinearGradient
        colors={["#0d1812", "#0d1812", "#0d1812"]}
        className="flex-1"
      >
        {/* Compact Header with Logo */}
        <View className="px-6 pt-3 pb-2">
          <Image
            source={require("../../assets/bazaaro.png")}
            style={{ width: 100, height: 30, alignSelf: "center" }}
            resizeMode="contain"
          />
        </View>

        {/* Compact Categories Horizontal Scroll */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-3 max-h-12"
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {categories.map((category) => (
            <Pressable
              key={category.name}
              onPress={() => handleCategoryPress(category.name)}
              className={`mr-2 px-4 py-2 rounded-full flex-row items-center ${
                selectedCategory === category.name
                  ? "bg-green-500"
                  : "bg-white/10"
              }`}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-base mr-1.5">{category.icon}</Text>
              <Text
                className={`text-sm font-semibold ${
                  selectedCategory === category.name
                    ? "text-white"
                    : "text-white/60"
                }`}
              >
                {category.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Posts Grid */}
        <ScrollView
          className="flex-1 px-3"
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor="#10b981"
              colors={["#10b981"]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View className="flex-1 justify-center items-center py-20">
              <ActivityIndicator size="large" color="#10b981" />
              <Text className="text-white/60 mt-3 text-sm">Loading posts...</Text>
            </View>
          ) : posts.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <View className="bg-white/5 rounded-full p-5 mb-3">
                <Feather name="inbox" size={40} color="#10b981" />
              </View>
              <Text className="text-white text-lg font-semibold mb-1">
                No Items Found
              </Text>
              <Text className="text-white/50 text-center text-sm px-8">
                No posts in {selectedCategory === "All" ? "any category" : selectedCategory} yet
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between pb-4">
              {posts.map((post) => (
                <Pressable
                  key={post.id}
                  onPress={() => handlePostPress(post.id)}
                  className="w-[48%] mb-3 bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                  style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                >
                  {/* Image */}
                  {post.images && post.images[0] ? (
                    <Image
                      source={{ uri: post.images[0] }}
                      className="w-full h-36"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-36 bg-white/10 justify-center items-center">
                      <Feather name="image" size={28} color="#ffffff40" />
                    </View>
                  )}

                  {/* Content */}
                  <View className="p-2.5">
                    {/* Title */}
                    <Text 
                      className="text-white font-semibold text-sm mb-1" 
                      numberOfLines={2}
                    >
                      {post.title}
                    </Text>

                    {/* Price */}
                    <Text className="text-green-500 font-bold text-base mb-1.5">
                      LKR {post.price?.toLocaleString()}
                    </Text>

                    {/* Category Badge */}
                    <View className="flex-row items-center">
                      <View className="bg-white/10 px-2 py-0.5 rounded-full">
                        <Text className="text-white/60 text-[10px]">
                          {post.category}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </Layout>
  )
}

export default Dashboard