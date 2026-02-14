import { View, Text, Pressable, ScrollView, Image } from "react-native"
import React, { useContext, useState } from "react"
import { AuthContext } from "@/context/AuthContext"
import { logoutUser } from "@/services/authService"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { uploadImageToCloudinary } from "@/services/cloudinaryService"
import { updateUserProfileImage } from "@/services/authService"
import { useLoader } from "@/hooks/useLoader"
import Toast from "react-native-toast-message"

const Profile = () => {
  const [localImage, setLocalImage] = useState<string | null>(null)
  const { showLoader, hideLoader } = useLoader()

  const pickImageFromDevice = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: "Permission Required",
        text2: "Gallery access is required",
        position: "top",
        visibilityTime: 3000,
      })
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && user) {
      try {
        showLoader()
        const imageUri = result.assets[0].uri
        const uploadedUrl = await uploadImageToCloudinary(imageUri)
        await updateUserProfileImage(user, uploadedUrl)
        setLocalImage(uploadedUrl)
        Toast.show({
          type: "success",
          text1: "Success! 🎉",
          text2: "Profile image updated",
          position: "top",
          visibilityTime: 2000,
        })
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Image upload failed",
          position: "top",
          visibilityTime: 3000,
        })
      } finally {
        hideLoader()
      }
    }
  }

  const { user } = useContext(AuthContext)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logoutUser()
      Toast.show({
        type: "success",
        text1: "Goodbye! 👋",
        text2: "Successfully logged out",
        position: "top",
        visibilityTime: 2000,
      })
      setTimeout(() => router.replace("/auth/login"), 500)
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Logout failed",
        position: "top",
        visibilityTime: 3000,
      })
    }
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
              My Profile
            </Text>
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
              <Feather name="chevron-right" size={26} color="#ffffff" />
            </View>
          </View>
        </Pressable>

        {/* Welcome Card */}
        <View className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-white text-xl font-bold mb-1">
                Welcome back 👋
              </Text>
              <Text className="text-green-500 text-lg font-semibold">
                {user?.displayName || "Bazaaro User"}
              </Text>
              <Text className="text-white/20 text-sm mt-1">
                Discover great local deals around you
              </Text>
            </View>
            <Pressable onPress={pickImageFromDevice}>
              <Image
                source={{
                  uri:
                    localImage ||
                    user?.photoURL ||
                    "https://ui-avatars.com/api/?name=Bazaaro&background=0F1A14&color=fff",
                }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  borderWidth: 2,
                  borderColor: "#10B981",
                }}
              />
            </Pressable>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-white font-semibold text-lg mb-3">
            Quick Actions
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              className="flex-1 bg-green-500 rounded-[60px] p-4 items-center"
              onPress={() => router.push("/tabs/dashboard")}
            >
              <Text className="text-white font-semibold">
                Browse Items
              </Text>
            </Pressable>
            <Pressable
              className="flex-1 bg-green-500 rounded-[60px] p-4 items-center"
              onPress={() => router.push("/tabs/post")}
            >
              <Text className="text-white font-semibold">
                Sell Item
              </Text>
            </Pressable>
          </View>
        </View>

        {/* My Posts Button - FIXED PATH */}
        <Pressable
          onPress={() => router.push("/profile/myPosts")}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 rounded-full bg-green-500/20 items-center justify-center mr-4">
                <Feather name="list" size={24} color="#10b981" />
              </View>
              <View>
                <Text className="text-white text-lg font-semibold">
                  My Posts
                </Text>
                <Text className="text-white/50 text-sm">
                  Manage your ads
                </Text>
              </View>
            </View>
            <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
              <Feather name="chevron-right" size={20} color="#10b981" />
            </View>
          </View>
        </Pressable>

        {/* Profile Settings Button - NEW */}
        <Pressable
          onPress={() => router.push("/profile/settings")}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 rounded-full bg-blue-500/20 items-center justify-center mr-4">
                <Feather name="settings" size={24} color="#3b82f6" />
              </View>
              <View>
                <Text className="text-white text-lg font-semibold">
                  Profile Settings
                </Text>
                <Text className="text-white/50 text-sm">
                  Edit your information
                </Text>
              </View>
            </View>
            <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
              <Feather name="chevron-right" size={20} color="#10b981" />
            </View>
          </View>
        </Pressable>

        {/* Account Info */}
        <View className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          <Text className="text-white/70 text-sm mb-1">
            Account Email
          </Text>
          <Text className="text-white text-base font-semibold mb-4">
            {user?.email}
          </Text>
          <View className="h-[1px] bg-white/20 mb-3" />
          <Text className="text-white/60 text-xs">
            Your account is protected with Firebase Authentication
          </Text>
        </View>

        {/* Logout */}
        <Pressable
          onPress={handleLogout}
          className="bg-red-500/90 py-4 rounded-[60px] mb-10"
        >
          <Text className="text-white text-lg font-semibold text-center">
            Sign Out
          </Text>
        </Pressable>
      </LinearGradient>
    </ScrollView>
  )
}

export default Profile