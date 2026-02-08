import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native"
import React, { useState } from "react"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { useLoader } from "@/hooks/useLoader"
import { login } from "@/services/authService"
import * as Google from "expo-auth-session/providers/google"
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Image } from "react-native"
import { Feather } from "@expo/vector-icons";



const Login = () => {
  const router = useRouter()
  const { showLoader, hideLoader, isLoading } = useLoader()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "YOUR_GOOGLE_CLIENT_ID"
  })

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }


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
      <LinearGradient
        colors={["#0F1A14", "#2F4F3A", "#5B7F5A", "#9c9c9c"]}
        className="flex-1 justify-center px-6"
      >

        {/* Title */}
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
            welcome Back You’ve Been Missed!
          </Text>
        </View>


        {/* Email */}
        <View className="flex-row items-center bg-white border border-white/20 p-4 mb-4 rounded-2xl">
          <Feather name="mail" size={18} color="#3b524391" className="mr-2" />
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            className="flex-1 text-black p-0"
            placeholderTextColor="#3b524391"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <View className="flex-row items-center bg-white border border-white/20 p-4 mb-6 rounded-2xl">
          <Feather name="lock" size={18} color="#3b524391" className="mr-2" />
          <TextInput
            placeholder="Password"
            secureTextEntry
            className="flex-1 text-black p-0"
            placeholderTextColor="#3b524391"
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

        {/* Google */}
        <Pressable
          onPress={() => promptAsync()}
          className="flex-row items-center justify-center py-4 rounded-2xl bg-black/90"
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
