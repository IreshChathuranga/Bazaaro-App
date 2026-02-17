import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native"
import React, { useState } from "react"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { login } from "@/services/authService"
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins'
import { Feather } from "@expo/vector-icons"
import Toast from "react-native-toast-message"

const Login = () => {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  })

  if (!fontsLoaded) {
    return null
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please enter email and password",
        position: "top",
        visibilityTime: 3000,
      })
      return
    }

    try {
      await login(email, password)
      Toast.show({
        type: "success",
        text1: "Welcome Back! 🎉",
        text2: "Successfully logged in",
        position: "top",
        visibilityTime: 2000,
      })
      setTimeout(() => router.replace("/tabs/profile"), 500)
    } catch (e: any) {
      console.error("Login error:", e)
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: e.message || "Invalid email or password",
        position: "top",
        visibilityTime: 4000,
      })
    }
  }

  const handleGooglePress = () => {
    Toast.show({
      type: "info",
      text1: "Coming Soon!",
      text2: "Google Sign-In will be available in a future update",
      position: "top",
      visibilityTime: 3000,
    })
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <LinearGradient
        colors={["#0F1A14", "#2F4F3A", "#5B7F5A", "#9c9c9c"]}
        className="flex-1 justify-center px-6"
      >
        {/* Logo */}
        <Image
          source={require("../../assets/bazaaro.png")}
          style={{
            width: 100,
            height: 30,
            alignSelf: "center",
            marginBottom: 8
          }}
          resizeMode="contain"
        />
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 32,
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            Hello Again!
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#ffffffa8",
              textAlign: "center",
              marginTop: 3,
              opacity: 0.8,
            }}
          >
            Welcome Back You've Been Missed!
          </Text>
        </View>

        {/* Email */}
        <View className="flex-row items-center bg-white/10 border border-white/20 p-4 mb-4 rounded-2xl">
          <Feather name="mail" size={18} color="#abb1ad91" className="mr-2" />
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            className="flex-1 text-black p-0"
            placeholderTextColor="#abb1ad91"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <View className="flex-row items-center bg-white/10 border border-white/20 p-4 mb-6 rounded-2xl">
          <Feather name="lock" size={18} color="#abb1ad91" className="mr-2" />
          <TextInput
            placeholder="Password"
            secureTextEntry
            className="flex-1 text-black p-0"
            placeholderTextColor="#abb1ad91"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Sign In */}
        <Pressable onPress={handleLogin}>
          <LinearGradient
            colors={["#1b2921", "#1b2921"]}
            className="py-4 rounded-2xl shadow-lg"
          >
            <Text className="text-white text-lg font-semibold text-center">
              Sign In
            </Text>
          </LinearGradient>
        </Pressable>

        {/* OR */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-[1px] bg-white/30" />
          <Text className="mx-3 text-emerald-200">OR</Text>
          <View className="flex-1 h-[1px] bg-white/30" />
        </View>

        {/* Google Button (Visual Only - Disabled) */}
        <Pressable
          onPress={handleGooglePress}
          className="flex-row items-center justify-center py-4 rounded-2xl bg-black"
        >
          <Image
            source={require("../../assets/google.png")}
            style={{ width: 22, height: 22, marginRight: 10 }}
            resizeMode="contain"
          />
          <Text className="text-white font-semibold text-base">
            Continue with Google
          </Text>
        </Pressable>

        {/* Register */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-emerald-100">New to Bazaaro? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text className="text-emerald-300 font-bold">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  )
}

export default Login