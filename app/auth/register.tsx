import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native"
import React, { useState } from "react"
import { useRouter } from "expo-router"
import { registerUser } from "@/services/authService"
import { useLoader } from "@/hooks/useLoader"

const Register = () => {
  const router = useRouter()
  const { showLoader, hideLoader, isLoading } = useLoader()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [conPassword, setConPassword] = useState("")

  const handleRegister = async () => {
    if (!name || !email || !password || !conPassword || isLoading) {
      Alert.alert("Please fill all fields")
      return
    }

    if (!email.includes("@")) {
      Alert.alert("Please enter valid email")
      return
    }

    if (password.length < 6) {
      Alert.alert("Password must be at least 6 characters")
      return
    }

    if (password !== conPassword) {
      Alert.alert("Passwords do not match")
      return
    }

    showLoader()
    try {
      await registerUser(name, email, password)
      Alert.alert("Success", "Account created successfully")
      router.replace("/tabs/home")
    } catch (e: any) {
      Alert.alert("Register failed", e.message)
    } finally {
      hideLoader()
    }
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-[#f8f7f4]"
    >
      <View className="flex-1 justify-center items-center px-5 py-10">
        {/* Header Section */}
        <View className="w-full mb-8 items-center">
          <Text className="text-4xl font-bold text-center mb-2 text-[#1a1a1a]">
            Create Account
          </Text>
          <Text className="text-center text-base text-[#666]">
            Join us and start your journey
          </Text>
        </View>

        {/* Form Container */}
        <View className="w-full bg-white rounded-3xl p-7 shadow-lg">
          {/* Name Input */}
          <View className="mb-4">
            <Text className="text-sm font-semibold mb-2 text-[#1a1a1a]">
              Full Name
            </Text>
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#aaa"
              className="border-2 border-[#e0e0e0] bg-[#f9f8f6] p-4 rounded-2xl text-base"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-sm font-semibold mb-2 text-[#1a1a1a]">
              Email Address
            </Text>
            <TextInput
              placeholder="your.email@example.com"
              placeholderTextColor="#aaa"
              autoCapitalize="none"
              keyboardType="email-address"
              className="border-2 border-[#e0e0e0] bg-[#f9f8f6] p-4 rounded-2xl text-base"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text className="text-sm font-semibold mb-2 text-[#1a1a1a]">
              Password
            </Text>
            <TextInput
              placeholder="Min 6 characters"
              placeholderTextColor="#aaa"
              secureTextEntry
              className="border-2 border-[#e0e0e0] bg-[#f9f8f6] p-4 rounded-2xl text-base"
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />
          </View>

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold mb-2 text-[#1a1a1a]">
              Confirm Password
            </Text>
            <TextInput
              placeholder="Re-enter your password"
              placeholderTextColor="#aaa"
              secureTextEntry
              className="border-2 border-[#e0e0e0] bg-[#f9f8f6] p-4 rounded-2xl text-base"
              value={conPassword}
              onChangeText={setConPassword}
              editable={!isLoading}
            />
          </View>

          {/* Register Button */}
          <Pressable
            onPress={handleRegister}
            disabled={isLoading}
            className="py-4 rounded-2xl flex-row justify-center items-center bg-[#c97a52]"
            style={{ opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-bold">Create Account</Text>
            )}
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-[1px] bg-[#e0e0e0]" />
            <Text className="mx-3 text-[#999]">OR</Text>
            <View className="flex-1 h-[1px] bg-[#e0e0e0]" />
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-[#666]">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
              <Text className="font-bold text-[#c97a52]">Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms Text */}
        <Text className="text-center text-xs mt-6 text-[#999] px-5" style={{ lineHeight: 18 }}>
          By creating an account, you agree to our{" "}
          <Text className="font-semibold text-[#1a1a1a]">Terms of Service</Text>
          {" "}and{" "}
          <Text className="font-semibold text-[#1a1a1a]">Privacy Policy</Text>
        </Text>
      </View>
    </ScrollView>
  )
}

export default Register