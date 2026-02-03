import { View, Text, ActivityIndicator, Image } from "react-native"
import { useEffect } from "react"
import { useRouter } from "expo-router"

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.replace("/auth/login") // or /tabs/home
    }, 2000)
  }, [])

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image
        source={require("../assets/logo.png")}
        className="w-32 h-32 mb-6"
        resizeMode="contain"
      />

      <ActivityIndicator size="large" color="#c97a52" />

      <Text className="mt-4 text-gray-500">
        Loading...
      </Text>
    </View>
  )
}
