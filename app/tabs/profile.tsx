'use client'

import { View, Text, Pressable, Alert, ScrollView, Image } from "react-native"
import React, { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"
import { logoutUser } from "@/services/authService"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"

const Profile = () => {
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
        colors={["#0F1A14", "#2F4F3A", "#5B7F5A", "#9c9c9c"]}
        className="flex-1 px-6 pt-10"
      >

        {/* Welcome Card */}
        <View className="bg-white/10 border border-black/20 rounded-3xl p-6 mb-6">

          {/* Header */}
          <Pressable
            onPress={() => router.replace("/tabs/dashboard")}
            className="flex-row items-center justify-between mb-4"
          >
            <Text className="text-white text-lg font-semibold">
              My Profile
            </Text>

            <Feather name="chevron-right" size={22} color="#A7F3D0" />
          </Pressable>

          {/* Logo */}
          <Image
            source={require("../../assets/bazaaro.png")}
            style={{ width: 110, height: 32, alignSelf: "center", marginBottom: 16 }}
            resizeMode="contain"
          />

          <Text className="text-black text-xl font-bold mb-2">
            Welcome back 👋
          </Text>

          <Text className="text-green-400 text-lg font-semibold">
            {user?.displayName || "Bazaaro User"}
          </Text>

          <Text className="text-black/70 text-sm mt-2">
            Discover great local deals around you
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-white font-semibold text-lg mb-3">
            Quick Actions
          </Text>

          <View className="flex-row gap-3">
            <Pressable className="flex-1 bg-white/15 border border-white/20 rounded-2xl p-4 items-center">
              <Text className="text-emerald-200 font-semibold">
                Browse Items
              </Text>
            </Pressable>

            <Pressable className="flex-1 bg-white/15 border border-white/20 rounded-2xl p-4 items-center">
              <Text className="text-emerald-200 font-semibold">
                Sell Item
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Account Info */}
        <View className="bg-white/10 border border-white/20 rounded-2xl p-5 mb-8">
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
          className="bg-red-500/90 py-4 rounded-2xl mb-10"
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
