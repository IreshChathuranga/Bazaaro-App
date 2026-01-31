import { View, Text, Pressable, Alert } from "react-native"
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
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold mb-2">
        Welcome 
      </Text>

      <Text className="text-lg text-gray-700 mb-6">
        {user?.displayName || "User"}
      </Text>

      <Text className="text-sm text-gray-500 mb-10">
        {user?.email}
      </Text>

      <Pressable
        onPress={handleLogout}
        className="bg-red-500 px-6 py-3 rounded-xl"
      >
        <Text className="text-white text-lg font-semibold">
          Logout
        </Text>
      </Pressable>
    </View>
  )
}

export default Home
