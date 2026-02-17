import React, { useState, useEffect, useContext } from "react"
import { View, Text, Image, Pressable, ScrollView, ActivityIndicator, Dimensions, Linking, Alert, Platform } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import { getPostById } from "@/services/postService"
import { getUserProfile } from "@/services/userService"
import type { PostWithId } from "@/services/postService"
import type { UserProfile } from "@/services/userService"
import Toast from "react-native-toast-message"
import { AuthContext } from "@/context/AuthContext"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const PostDetail = () => {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { user } = useContext(AuthContext)
  const [post, setPost] = useState<PostWithId | null>(null)
  const [sellerProfile, setSellerProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    loadPost()
  }, [id])

  const loadPost = async () => {
    try {
      const postId = Array.isArray(id) ? id[0] : id
      const fetchedPost = await getPostById(postId)
      
      if (fetchedPost) {
        setPost(fetchedPost)
        console.log("✅ Post loaded:", fetchedPost.title)
        console.log("👤 Current user:", user?.uid)
        console.log("🛒 Seller:", fetchedPost.userId)
        
        try {
          const profile = await getUserProfile(fetchedPost.userId)
          console.log("📞 Seller profile:", profile)
          setSellerProfile(profile)
        } catch (profileError) {
          console.error("❌ Error loading seller profile:", profileError)
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Post Not Found",
          text2: "This post may have been deleted",
          position: "top",
          visibilityTime: 3000,
        })
        router.back()
      }
    } catch (error) {
      console.error("Error loading post:", error)
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not load post details",
        position: "top",
        visibilityTime: 3000,
      })
      router.back()
    } finally {
      setLoading(false)
    }
  }

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    setCurrentImageIndex(slideIndex)
  }

  const handleWhatsApp = () => {
    const phoneNumber = sellerProfile?.phone || sellerProfile?.mobile
    
    if (!phoneNumber) {
      Toast.show({
        type: "error",
        text1: "No Phone Number",
        text2: "Seller hasn't added a phone number yet",
        position: "top",
        visibilityTime: 3000,
      })
      return
    }

    let cleanNumber = phoneNumber.replace(/\D/g, '')
    if (!cleanNumber.startsWith('94') && cleanNumber.startsWith('0')) {
      cleanNumber = '94' + cleanNumber.substring(1)
    }

    const message = `Hi! I'm interested in your ${post?.title} listed on Bazaaro for LKR ${post?.price?.toLocaleString()}.`
    const url = `whatsapp://send?phone=${cleanNumber}&text=${encodeURIComponent(message)}`

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url)
        } else {
          Toast.show({
            type: "error",
            text1: "WhatsApp Not Installed",
            text2: "Please install WhatsApp to continue",
            position: "top",
            visibilityTime: 3000,
          })
        }
      })
      .catch((err) => {
        console.error("WhatsApp error:", err)
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Could not open WhatsApp",
          position: "top",
          visibilityTime: 3000,
        })
      })
  }

  const handleCall = () => {
    const phoneNumber = sellerProfile?.phone || sellerProfile?.mobile
    
    if (!phoneNumber) {
      Toast.show({
        type: "error",
        text1: "No Phone Number",
        text2: "Seller hasn't added a phone number yet",
        position: "top",
        visibilityTime: 3000,
      })
      return
    }

    const url = `tel:${phoneNumber}`
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url)
        } else {
          Toast.show({
            type: "error",
            text1: "Cannot Make Call",
            text2: "Your device doesn't support calls",
            position: "top",
            visibilityTime: 3000,
          })
        }
      })
      .catch((err) => {
        console.error("Call error:", err)
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Could not initiate call",
          position: "top",
          visibilityTime: 3000,
        })
      })
  }

  const handleMessage = () => {
    const phoneNumber = sellerProfile?.phone || sellerProfile?.mobile
    
    if (!phoneNumber) {
      Toast.show({
        type: "error",
        text1: "No Phone Number",
        text2: "Seller hasn't added a phone number yet",
        position: "top",
        visibilityTime: 3000,
      })
      return
    }

    Alert.alert(
      "Send Message",
      "Choose how you want to send a message",
      [
        {
          text: "📱 In-App Chat",
          onPress: () => {
            Toast.show({
              type: "info",
              text1: "Coming Soon! 🚀",
              text2: "In-app messaging will be available soon",
              position: "top",
              visibilityTime: 3000,
            })
          }
        },
        {
          text: "💬 Phone SMS",
          onPress: () => {
            const message = `Hi! I'm interested in your ${post?.title} on Bazaaro (LKR ${post?.price?.toLocaleString()}).`
            const separator = Platform.OS === 'ios' ? '&' : '?'
            const url = `sms:${phoneNumber}${separator}body=${encodeURIComponent(message)}`
            
            Linking.openURL(url).catch((err) => {
              console.error("SMS error:", err)
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Could not open messages app",
                position: "top",
                visibilityTime: 3000,
              })
            })
          }
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ],
      { cancelable: true }
    )
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0d1812]">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-white/60 mt-3">Loading details...</Text>
      </View>
    )
  }

  if (!post) {
    return null
  }

  const isOwnPost = user?.uid === post.userId

  return (
    <ScrollView className="flex-1 bg-[#0d1812]">
      <LinearGradient
        colors={["#0d1812", "#0d1812", "#0d1812"]}
        className="flex-1"
      >
        <View className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {post.images && post.images.length > 0 ? (
              post.images.map((image, index) => (
                <View key={index} style={{ width: SCREEN_WIDTH }}>
                  <Image
                    source={{ uri: image }}
                    className="w-full h-80"
                    resizeMode="cover"
                  />
                </View>
              ))
            ) : (
              <View className="w-full h-80 bg-white/10 justify-center items-center" style={{ width: SCREEN_WIDTH }}>
                <Feather name="image" size={60} color="#ffffff40" />
              </View>
            )}
          </ScrollView>

          <Pressable
            onPress={() => router.replace("/tabs/dashboard")}
            className="absolute top-10 left-4 w-10 h-10 rounded-full bg-black/50 items-center justify-center"
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </Pressable>

          {post.images && post.images.length > 1 && (
            <View className="absolute bottom-4 right-4 bg-black/60 px-3 py-1.5 rounded-full">
              <Text className="text-white text-xs font-semibold">
                {currentImageIndex + 1} / {post.images.length}
              </Text>
            </View>
          )}

          {post.images && post.images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
              {post.images.map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentImageIndex ? "bg-green-500" : "bg-white/40"
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        <View className="px-5 py-6">
          <View className="flex-row items-center mb-3">
            <View className="bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/30">
              <Text className="text-green-500 text-xs font-semibold">
                {post.category}
              </Text>
            </View>
          </View>

          <Text className="text-white text-2xl font-bold mb-2">
            {post.title}
          </Text>

          <Text className="text-green-500 text-3xl font-bold mb-4">
            LKR {post.price?.toLocaleString()}
          </Text>

          <View className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
            <Text className="text-white font-semibold text-base mb-2">
              Description
            </Text>
            <Text className="text-white/70 text-sm leading-6">
              {post.description}
            </Text>
          </View>

          <View className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
            <Text className="text-white font-semibold text-base mb-3">
              Details
            </Text>
            
            {post.category === "Cars" || post.category === "Motorbikes" ? (
              <View className="gap-3">
                {post.brand && <DetailRow label="Brand" value={post.brand} />}
                {post.model && <DetailRow label="Model" value={post.model} />}
                {post.year && <DetailRow label="Year" value={post.year.toString()} />}
                {post.mileage && <DetailRow label="Mileage" value={`${post.mileage.toLocaleString()} km`} />}
                {post.condition && <DetailRow label="Condition" value={post.condition} />}
              </View>
            ) : post.category === "Phones" ? (
              <View className="gap-3">
                {post.brand && <DetailRow label="Brand" value={post.brand} />}
                {post.model && <DetailRow label="Model" value={post.model} />}
                {post.storage && <DetailRow label="Storage" value={post.storage} />}
                {post.ram && <DetailRow label="RAM" value={post.ram} />}
                {post.condition && <DetailRow label="Condition" value={post.condition} />}
              </View>
            ) : post.category === "Property" ? (
              <View className="gap-3">
                {post.location && <DetailRow label="Location" value={post.location} />}
                {post.bedrooms && <DetailRow label="Bedrooms" value={post.bedrooms.toString()} />}
                {post.bathrooms && <DetailRow label="Bathrooms" value={post.bathrooms.toString()} />}
                {post.sqft && <DetailRow label="Square Feet" value={post.sqft.toLocaleString()} />}
                {post.condition && <DetailRow label="Condition" value={post.condition} />}
              </View>
            ) : (
              post.condition && <DetailRow label="Condition" value={post.condition} />
            )}
          </View>

          <View className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
            <Text className="text-white font-semibold text-base mb-3">
              Seller Information
            </Text>
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-green-500/20 items-center justify-center mr-3">
                <Feather name="user" size={24} color="#10b981" />
              </View>
              <View>
                <Text className="text-white font-semibold text-base">
                  {post.userName}
                </Text>
                <Text className="text-white/50 text-sm">
                  {isOwnPost ? "You (Seller)" : "Seller"}
                </Text>
              </View>
            </View>
          </View>

          {/* ⚠️ ALWAYS SHOW BUTTONS FOR TESTING - Remove condition temporarily */}
          <View className="mb-6">
            <Text className="text-white font-semibold text-base mb-3">
              Contact Seller {isOwnPost && "(Testing - Your Own Post)"}
            </Text>
            
            <View className="flex-row gap-3 mb-3">
              <Pressable
                onPress={handleWhatsApp}
                className="flex-1 bg-[#25D366] py-3.5 rounded-2xl"
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <View className="flex-row items-center justify-center">
                  <Feather name="message-circle" size={20} color="#fff" />
                  <Text className="text-white font-semibold ml-2">
                    WhatsApp
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleCall}
                className="flex-1 bg-blue-500 py-3.5 rounded-2xl"
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <View className="flex-row items-center justify-center">
                  <Feather name="phone" size={20} color="#fff" />
                  <Text className="text-white font-semibold ml-2">
                    Call
                  </Text>
                </View>
              </Pressable>
            </View>

            <Pressable
              onPress={handleMessage}
              className="bg-green-500 py-3.5 rounded-2xl"
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View className="flex-row items-center justify-center">
                <Feather name="mail" size={20} color="#fff" />
                <Text className="text-white font-semibold ml-2">
                  Send Message
                </Text>
              </View>
            </Pressable>
          </View>

          <Text className="text-white/40 text-xs text-center mb-6">
            Posted on {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : "Recently"}
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  )
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between items-center">
    <Text className="text-white/60 text-sm">{label}</Text>
    <Text className="text-white font-semibold text-sm">{value}</Text>
  </View>
)

export default PostDetail