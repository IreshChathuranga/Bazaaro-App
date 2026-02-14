import React, { useState, useContext } from "react"
import { View, Text, TextInput, Pressable, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import { AuthContext } from "@/context/AuthContext"
import { changeUserEmail, changeUserPassword } from "@/services/userService"
import { useLoader } from "@/hooks/useLoader"
import Toast from "react-native-toast-message"

const SecuritySettings = () => {
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const { showLoader, hideLoader } = useLoader()

  // Email change states
  const [newEmail, setNewEmail] = useState("")
  const [emailPassword, setEmailPassword] = useState("")

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleChangeEmail = async () => {
    if (!newEmail || !emailPassword) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please fill all fields",
        position: "top",
        visibilityTime: 3000,
      })
      return
    }

    try {
      showLoader()
      await changeUserEmail(newEmail, emailPassword)
      Toast.show({
        type: "success",
        text1: "Email Changed! ✓",
        text2: "Your email has been updated",
        position: "top",
        visibilityTime: 2000,
      })
      setNewEmail("")
      setEmailPassword("")
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Change Failed",
        text2: error.message || "Could not change email",
        position: "top",
        visibilityTime: 3000,
      })
    } finally {
      hideLoader()
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please fill all fields",
        position: "top",
        visibilityTime: 3000,
      })
      return
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "Passwords do not match",
        position: "top",
        visibilityTime: 3000,
      })
      return
    }

    if (newPassword.length < 6) {
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
      showLoader()
      await changeUserPassword(currentPassword, newPassword)
      Toast.show({
        type: "success",
        text1: "Password Changed! ✓",
        text2: "Your password has been updated",
        position: "top",
        visibilityTime: 2000,
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Change Failed",
        text2: error.message || "Could not change password",
        position: "top",
        visibilityTime: 3000,
      })
    } finally {
      hideLoader()
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        colors={["#0d1812", "#0d1812", "#0d1812"]}
        className="flex-1 px-6 pt-10"
      >
        {/* Header */}
        <Pressable
          onPress={() => router.back()}
          className="border border-white rounded-[60px] px-3 py-5 mb-6"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-2xl font-semibold">
              Security Settings
            </Text>
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
              <Feather name="arrow-left" size={26} color="#ffffff" />
            </View>
          </View>
        </Pressable>

        {/* Current Email Display */}
        <View className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
          <Text className="text-white/60 text-sm mb-1">Current Email</Text>
          <Text className="text-white text-base font-semibold">{user?.email}</Text>
        </View>

        {/* Change Email Section */}
        <View className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-6">
          <Text className="text-white font-bold text-lg mb-4">Change Email</Text>
          
          <SecureInputField
            label="New Email"
            icon="mail"
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="Enter new email"
            keyboardType="email-address"
          />

          <SecureInputField
            label="Current Password"
            icon="lock"
            value={emailPassword}
            onChangeText={setEmailPassword}
            placeholder="Confirm with password"
            secureTextEntry
          />

          <Pressable onPress={handleChangeEmail} className="bg-green-500 py-3 rounded-full mt-2">
            <Text className="text-white text-base font-semibold text-center">
              Update Email
            </Text>
          </Pressable>
        </View>

        {/* Change Password Section */}
        <View className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-10">
          <Text className="text-white font-bold text-lg mb-4">Change Password</Text>

          <SecureInputField
            label="Current Password"
            icon="lock"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            secureTextEntry
          />

          <SecureInputField
            label="New Password"
            icon="lock"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            secureTextEntry
          />

          <SecureInputField
            label="Confirm New Password"
            icon="lock"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter new password"
            secureTextEntry
          />

          <Pressable onPress={handleChangePassword} className="bg-green-500 py-3 rounded-full mt-2">
            <Text className="text-white text-base font-semibold text-center">
              Update Password
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </ScrollView>
  )
}

// Reusable Secure Input Component
const SecureInputField = ({ 
  label, 
  icon, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry = false,
  keyboardType = "default" as any
}: any) => (
  <View className="mb-4">
    <Text className="text-white font-semibold text-sm mb-2">{label}</Text>
    <View className="flex-row items-center bg-white/10 border border-white/20 rounded-2xl p-4">
      <Feather name={icon} size={18} color="#10b981" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#ffffff40"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        className="flex-1 text-white ml-3"
      />
    </View>
  </View>
)

export default SecuritySettings