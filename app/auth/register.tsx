import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image
} from "react-native"
import React, { useState, useEffect } from "react"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { useLoader } from "@/hooks/useLoader"
import { registerUser } from "@/services/authService"
import * as Google from "expo-auth-session/providers/google"
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins"
import { Feather } from "@expo/vector-icons"
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth"
import { auth } from "@/services/firebase"
import * as WebBrowser from "expo-web-browser"

WebBrowser.maybeCompleteAuthSession()

const Register = () => {
  const router = useRouter()
  const { showLoader, hideLoader } = useLoader()

  const [fontsLoaded] = useFonts({ Poppins_700Bold })
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [conPassword, setConPassword] = useState("")

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  })

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken
      const accessToken = response.authentication?.accessToken

      if (!idToken) {
        Alert.alert("Google Login Failed", "Missing ID token")
        return
      }

      const credential = GoogleAuthProvider.credential(idToken, accessToken)

      showLoader()
      signInWithCredential(auth, credential)
        .then(() => {
          hideLoader()
          router.replace("/tabs/home")
        })
        .catch((error) => {
          hideLoader()
          Alert.alert("Google Login Failed", error.message)
        })
    } else if (response?.type === "error") {
      Alert.alert("Authentication Error", response.error?.message || "Something went wrong")
    }
  }, [response])

  if (!fontsLoaded) return null

  const handleRegister = async () => {
    if (!name || !email || !password || !conPassword) {
      Alert.alert("Please fill all fields")
      return
    }

    if (password !== conPassword) {
      Alert.alert("Passwords do not match")
      return
    }

    showLoader()
    try {
      await registerUser(name, email, password)
      router.replace("/tabs/home")
    } catch (e) {
      Alert.alert("Registration failed")
    } finally {
      hideLoader()
    }
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
        <View className="flex-row items-center bg-white border border-white/20 p-4 mb-4 rounded-2xl">
          <Feather name="user" size={18} color="#3b524391" className="mr-2" />
          <TextInput placeholder="Full Name" className="flex-1 text-black p-0" placeholderTextColor="#3b524391" value={name} onChangeText={setName} />
        </View>

        {/* Email */}
        <View className="flex-row items-center bg-white border border-white/20 p-4 mb-4 rounded-2xl">
          <Feather name="mail" size={18} color="#3b524391" className="mr-2" />
          <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" className="flex-1 text-black p-0" placeholderTextColor="#3b524391" value={email} onChangeText={setEmail} />
        </View>

        {/* Password */}
        <View className="flex-row items-center bg-white border border-white/20 p-4 mb-4 rounded-2xl">
          <Feather name="lock" size={18} color="#3b524391" className="mr-2" />
          <TextInput placeholder="Password" secureTextEntry className="flex-1 text-black p-0" placeholderTextColor="#3b524391" value={password} onChangeText={setPassword} />
        </View>

        {/* Confirm Password */}
        <View className="flex-row items-center bg-white border border-white/20 p-4 mb-6 rounded-2xl">
          <Feather name="lock" size={18} color="#3b524391" className="mr-2" />
          <TextInput placeholder="Confirm Password" secureTextEntry className="flex-1 text-black p-0" placeholderTextColor="#3b524391" value={conPassword} onChangeText={setConPassword} />
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

        {/* Google Register */}
        <Pressable 
          onPress={() => promptAsync()} 
          disabled={!request}
          className="flex-row items-center justify-center py-4 rounded-2xl bg-black/90"
        >
          <Image source={require("../../assets/google.png")} style={{ width: 22, height: 22, marginRight: 10 }} resizeMode="contain" />
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