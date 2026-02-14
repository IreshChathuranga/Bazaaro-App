import React, { useState, useEffect, useContext } from "react"
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import { AuthContext } from "@/context/AuthContext"
import { getUserProfile, updateUserProfile, type UserProfile } from "@/services/userService"
import { useLoader } from "@/hooks/useLoader"
import Toast from "react-native-toast-message"

const ProfileSettings = () => {
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const { showLoader, hideLoader } = useLoader()

  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [mobile, setMobile] = useState("")
  const [address, setAddress] = useState("")
  const [bio, setBio] = useState("")

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const profile = await getUserProfile(user!.uid)
      if (profile) {
        setName(profile.name || "")
        setPhone(profile.phone || "")
        setMobile(profile.mobile || "")
        setAddress(profile.address || "")
        setBio(profile.bio || "")
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Name Required",
        text2: "Please enter your name",
        position: "top",
        visibilityTime: 3000,
      })
      return
    }

    try {
      showLoader()
      await updateUserProfile(user!.uid, {
        name,
        phone,
        mobile,
        address,
        bio,
      } as Partial<UserProfile>)

      Toast.show({
        type: "success",
        text1: "Success! 🎉",
        text2: "Profile updated successfully",
        position: "top",
        visibilityTime: 2000,
      })
      setTimeout(() => router.replace("/tabs/profile"), 1000)
    } catch (error) {
      console.error("Error saving profile:", error)
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Could not update profile",
        position: "top",
        visibilityTime: 3000,
      })
    } finally {
      hideLoader()
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0d1812]">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-white/60 mt-3">Loading profile...</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        colors={["#0d1812", "#0d1812", "#0d1812"]}
        className="flex-1 px-6 pt-10"
      >
        {/* Header */}
        <Pressable
          onPress={() => router.replace("/tabs/profile")}
          className="border border-white rounded-[60px] px-3 py-5 mb-6"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-2xl font-semibold">
              Profile Settings
            </Text>
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
              <Feather name="arrow-left" size={26} color="#ffffff" />
            </View>
          </View>
        </Pressable>

        {/* Info Card */}
        <View className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-6">
          <View className="flex-row items-start">
            <Feather name="info" size={20} color="#10b981" className="mr-2" />
            <Text className="text-white/70 text-sm flex-1 ml-2">
              Update your personal information below
            </Text>
          </View>
        </View>

        {/* Form Fields */}
        <View className="mb-6">
          <InputField
            label="Full Name *"
            icon="user"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
          />

          <InputField
            label="Phone Number"
            icon="phone"
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g., +94 11 234 5678"
            keyboardType="phone-pad"
          />

          <InputField
            label="Mobile Number"
            icon="smartphone"
            value={mobile}
            onChangeText={setMobile}
            placeholder="e.g., +94 77 123 4567"
            keyboardType="phone-pad"
          />

          <InputField
            label="Address"
            icon="map-pin"
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            multiline
          />

          <InputField
            label="Bio"
            icon="file-text"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself..."
            multiline
          />
        </View>

        {/* Save Button */}
        <Pressable onPress={handleSave} className="bg-green-500 py-4 rounded-[60px] mb-6">
          <Text className="text-white text-lg font-semibold text-center">
            Save Changes
          </Text>
        </Pressable>

        {/* Security Settings Link */}
        <Pressable
          onPress={() => router.push("/profile/security")}
          className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-10"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 rounded-full bg-red-500/20 items-center justify-center mr-4">
                <Feather name="lock" size={24} color="#ef4444" />
              </View>
              <View>
                <Text className="text-white text-lg font-semibold">
                  Security Settings
                </Text>
                <Text className="text-white/50 text-sm">
                  Change email & password
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#10b981" />
          </View>
        </Pressable>
      </LinearGradient>
    </ScrollView>
  )
}

// Reusable Input Component
const InputField = ({ 
  label, 
  icon, 
  value, 
  onChangeText, 
  placeholder, 
  multiline = false,
  keyboardType = "default" as any
}: any) => (
  <View className="mb-4">
    <Text className="text-white font-semibold text-base mb-2">{label}</Text>
    <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl p-4">
      <Feather name={icon} size={18} color="#10b981" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#ffffff40"
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        keyboardType={keyboardType}
        className="flex-1 text-white ml-3"
        style={{ textAlignVertical: multiline ? "top" : "center" }}
      />
    </View>
  </View>
)

export default ProfileSettings