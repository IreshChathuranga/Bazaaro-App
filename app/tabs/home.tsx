'use client';

import { View, Text, Pressable, Alert, ScrollView } from "react-native"
import React, { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"
import { logoutUser } from "@/services/authService"
import { useRouter } from "expo-router"

const Home = () => {
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
    <ScrollView className="flex-1 bg-orange-50">
      <View className="px-6 pt-6 pb-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-4xl font-bold text-orange-700">Bazaaro</Text>
          <Text className="text-sm text-gray-600 mt-1">Discover Your Community</Text>
        </View>

        {/* Welcome Section */}
        <View className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-6 mb-6">
          <Text className="text-white text-xl font-bold mb-2">
            Welcome back, {user?.displayName || "Friend"}!
          </Text>
          <Text className="text-orange-100 text-sm">
            Browse local listings and find great deals in your area
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">Quick Actions</Text>
          <View className="flex-row gap-3">
            <Pressable className="flex-1 bg-white rounded-2xl p-4 items-center justify-center border border-orange-200">
              <Text className="text-orange-600 font-semibold text-sm">Browse Items</Text>
            </Pressable>
            <Pressable className="flex-1 bg-white rounded-2xl p-4 items-center justify-center border border-orange-200">
              <Text className="text-orange-600 font-semibold text-sm">Sell Item</Text>
            </Pressable>
          </View>
        </View>

        {/* User Info */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-orange-100">
          <Text className="text-sm text-gray-600 mb-1">Account Email</Text>
          <Text className="text-base font-semibold text-gray-800 mb-4">
            {user?.email}
          </Text>
          <View className="h-px bg-orange-100 mb-4" />
          <Text className="text-xs text-gray-500">
            Keep your email safe and secure
          </Text>
        </View>

        {/* Logout Button */}
        <Pressable
          onPress={handleLogout}
          className="bg-red-500 px-6 py-4 rounded-2xl mb-6"
        >
          <Text className="text-white text-lg font-semibold text-center">
            Sign Out
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default Home
