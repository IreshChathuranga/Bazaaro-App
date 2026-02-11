import { View, Text, Pressable, Alert, ScrollView, Image } from "react-native"
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

const Profile = () => {
  const [localImage, setLocalImage] = useState<string | null>(null)
  const { showLoader, hideLoader } = useLoader()

  const pickImageFromDevice = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      alert("Permission required to access gallery")
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

        Alert.alert("Success", "Profile image updated")
      } catch (error) {
        Alert.alert("Error", "Image upload failed")
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
      router.replace("/auth/login")
    } catch (e) {
      Alert.alert("Error", "Logout failed")
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

            {/* Arrow Circle */}
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
              <Feather name="chevron-right" size={26} color="#ffffff" />
            </View>
          </View>
        </Pressable>


        {/* Welcome Card */}
        <View className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6">
          <View className="flex-row items-center justify-between">

            {/* Left Side */}
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

            {/* Right Side - Profile Image */}
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
                  borderColor: "#10B981", // emerald
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
            <Pressable className="flex-1 bg-green-500 rounded-[60px] p-4 items-center"
              onPress={() => router.push("/tabs/dashboard")} >
              <Text className="text-white font-semibold">
                Browse Items
              </Text>
            </Pressable>

            <Pressable className="flex-1 bg-green-500 rounded-[60px] p-4 items-center"
              onPress={() => router.push("/tabs/post")} >
              <Text className="text-white font-semibold">
                Sell Item
              </Text>
            </Pressable>
          </View>
        </View>

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
