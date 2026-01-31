import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Keyboard,
  Alert,
  ScrollView
} from "react-native"
import React, { useState } from "react"
import { useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { login } from "@/services/authService"

const Login = () => {
  const router = useRouter()
  const { showLoader, hideLoader, isLoading } = useLoader()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    if (!email || !password || isLoading) {
      Alert.alert("Please enter email and password")
      return
    }

    showLoader()
    try {
      await login(email, password)
    } catch (e) {
      Alert.alert("Login fail")
    } finally {
      hideLoader()
    }
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <View className="w-full bg-white rounded-2xl p-8 shadow-lg">
          <Text className="text-3xl font-bold mb-6 text-center">Login</Text>

          <TextInput
            placeholder="email"
            autoCapitalize="none"
            keyboardType="email-address"
            className="border bg-gray-200 p-3 mb-4 rounded-xl"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="password"
            secureTextEntry
            className="border bg-gray-200 p-3 mb-4 rounded-xl"
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            onPress={handleLogin}
            className="bg-blue-600 py-3 rounded-2xl"
          >
            <Text className="text-white text-lg text-center">Login</Text>
          </Pressable>

          <View className="flex-row justify-center mt-3">
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text className="text-blue-600 font-semibold">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default Login
