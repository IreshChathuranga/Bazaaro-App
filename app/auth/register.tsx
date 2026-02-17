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
import { registerUser } from "@/services/authService"
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins"
import { Feather } from "@expo/vector-icons"
import Toast from "react-native-toast-message"

const Register = () => {
  const router = useRouter()

  const [fontsLoaded] = useFonts({ Poppins_700Bold })
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [conPassword, setConPassword] = useState("")

  if (!fontsLoaded) return null

  const handleRegister = async () => {
    if (!name || !email || !password || !conPassword) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please fill all fields",
        position: "top",
        visibilityTime: 3000,
      })
      return
    }

    if (password !== conPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "Passwords do not match",
        position: "top",
        visibilityTime: 3000,
      })
      return
    }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Weak Password",
        text2: "Password must be at least 6 characters",
        position: "top",
        visibilityTime: 3000,
      })
      return
    }

    try {
      await registerUser(name, email, password)
      Toast.show({
        type: "success",
        text1: "Account Created! 🎉",
        text2: "Welcome to Bazaaro",
        position: "top",
        visibilityTime: 2000,
      })
      setTimeout(() => router.replace("/tabs/profile"), 500)
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: e.message || "Something went wrong",
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
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        colors={["#0F1A14", "#2F4F3A", "#5B7F5A", "#9c9c9c"]}
        className="flex-1 justify-center px-6"
      >
        {/* Logo */}
        <Image
          source={require("../../assets/bazaaro.png")}
          style={{ width: 100, height: 30, alignSelf: "center", marginBottom: 8 }}
          resizeMode="contain"
        />
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 32, color: "#fff", textAlign: "center" }}>
            Create Account
          </Text>
          <Text style={{ fontSize: 14, color: "#ffffffa8", textAlign: "center", marginTop: 3 }}>
            Let's Create Account Together
          </Text>
        </View>

        {/* Name */}
        <View className="flex-row items-center bg-white/10 border border-white/20 p-4 mb-4 rounded-2xl">
          <Feather name="user" size={18} color="#abb1ad91" className="mr-2" />
          <TextInput 
            placeholder="Full Name" 
            className="flex-1 text-black p-0" 
            placeholderTextColor="#abb1ad91" 
            value={name} 
            onChangeText={setName} 
          />
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
        <View className="flex-row items-center bg-white/10 border border-white/20 p-4 mb-4 rounded-2xl">
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

        {/* Confirm Password */}
        <View className="flex-row items-center bg-white/10 border border-white/20 p-4 mb-6 rounded-2xl">
          <Feather name="lock" size={18} color="#abb1ad91" className="mr-2" />
          <TextInput 
            placeholder="Confirm Password" 
            secureTextEntry 
            className="flex-1 text-black p-0" 
            placeholderTextColor="#abb1ad91" 
            value={conPassword} 
            onChangeText={setConPassword} 
          />
        </View>

        {/* Register Button */}
        <Pressable onPress={handleRegister}>
          <LinearGradient colors={["#1b2921", "#1b2921"]} className="py-4 rounded-2xl">
            <Text className="text-white text-lg font-semibold text-center">Create Account</Text>
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
          <Text className="text-white font-semibold text-base">Continue with Google</Text>
        </Pressable>

        {/* Login */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-emerald-100">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-emerald-300 font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  )
}

export default Register