import React, { useContext, useState } from "react"
import { View, Text, Pressable, ScrollView, TextInput, Image } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import { AuthContext } from "@/context/AuthContext"
import Toast from "react-native-toast-message"
import * as ImagePicker from "expo-image-picker"
import { uploadImageToCloudinary } from "@/services/cloudinaryService"
import { createPost } from "@/services/postService"
import { useLoader } from "@/hooks/useLoader"

const PhonesPost = () => {
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const { showLoader, hideLoader } = useLoader()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [storage, setStorage] = useState("")
  const [ram, setRam] = useState("")
  const [condition, setCondition] = useState("Used")
  const [images, setImages] = useState<string[]>([])

  const pickImage = async (useCamera: boolean = false) => {
    try {
      let result
      if (useCamera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync()
        if (!permission.granted) {
          Toast.show({
            type: "error",
            text1: "Permission Denied",
            text2: "Camera access is required",
            position: "top",
            visibilityTime: 3000,
          })
          return
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        })
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!permission.granted) {
          Toast.show({
            type: "error",
            text1: "Permission Denied",
            text2: "Gallery access is required",
            position: "top",
            visibilityTime: 3000,
          })
          return
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        })
      }

      if (!result.canceled) {
        showLoader()
        const uploadedUrl = await uploadImageToCloudinary(result.assets[0].uri)
        setImages([...images, uploadedUrl])
        hideLoader()
        Toast.show({
          type: "success",
          text1: "Image Added",
          text2: "Image uploaded successfully",
          position: "top",
          visibilityTime: 2000,
        })
      }
    } catch (error) {
      hideLoader()
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: "Could not upload image",
        position: "top",
        visibilityTime: 3000,
      })
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!title || !description || !price || !brand || !model || images.length === 0) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please fill all required fields and add at least one image",
        position: "top",
        visibilityTime: 3000,
      })
      return
    }

    try {
      showLoader()
      await createPost({
        userId: user!.uid,
        userName: user!.displayName || "Anonymous",
        userEmail: user!.email || "",
        category: "Phones",
        title,
        description,
        price: parseFloat(price),
        images,
        brand,
        model,
        storage,
        ram,
        condition,
        status: "active",
        views: 0,
        createdAt: null,
      })
      hideLoader()
      Toast.show({
        type: "success",
        text1: "Success! 🎉",
        text2: "Your phone ad has been posted",
        position: "top",
        visibilityTime: 2000,
      })
      setTimeout(() => router.replace("/tabs/post"), 1000)
    } catch (error) {
      hideLoader()
      Toast.show({
        type: "error",
        text1: "Post Failed",
        text2: "Could not create post",
        position: "top",
        visibilityTime: 3000,
      })
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        colors={["#0d1812", "#0d1812", "#0d1812", "#0d1812"]}
        className="flex-1 px-6 pt-10"
      >
        <Pressable
          onPress={() => router.replace("/tabs/post")}
          className="border border-white rounded-[60px] px-3 py-5 mb-6"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-2xl font-semibold">
              Post Phone Ad 📱
            </Text>
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
              <Feather name="arrow-left" size={26} color="#ffffff" />
            </View>
          </View>
        </Pressable>

        <Text className="text-white font-semibold text-lg mb-3">Add Photos</Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          {images.map((img, index) => (
            <View key={index} className="relative">
              <Image source={{ uri: img }} style={{ width: 100, height: 100, borderRadius: 12 }} />
              <Pressable
                onPress={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
              >
                <Feather name="x" size={16} color="#fff" />
              </Pressable>
            </View>
          ))}
          <Pressable onPress={() => pickImage(false)} className="w-24 h-24 bg-white/5 border border-white/10 rounded-2xl items-center justify-center">
            <Feather name="image" size={28} color="#10b981" />
            <Text className="text-white/60 text-xs mt-1">Gallery</Text>
          </Pressable>
          <Pressable onPress={() => pickImage(true)} className="w-24 h-24 bg-white/5 border border-white/10 rounded-2xl items-center justify-center">
            <Feather name="camera" size={28} color="#10b981" />
            <Text className="text-white/60 text-xs mt-1">Camera</Text>
          </Pressable>
        </View>

        <InputField label="Title" value={title} onChangeText={setTitle} placeholder="e.g., iPhone 13 Pro Max" />
        <InputField label="Description" value={description} onChangeText={setDescription} placeholder="Describe your phone..." multiline />
        <InputField label="Price (LKR)" value={price} onChangeText={setPrice} placeholder="e.g., 250000" keyboardType="numeric" />
        <InputField label="Brand" value={brand} onChangeText={setBrand} placeholder="e.g., Apple" />
        <InputField label="Model" value={model} onChangeText={setModel} placeholder="e.g., iPhone 13 Pro Max" />
        <InputField label="Storage" value={storage} onChangeText={setStorage} placeholder="e.g., 256GB" />
        <InputField label="RAM" value={ram} onChangeText={setRam} placeholder="e.g., 6GB" />

        <Text className="text-white font-semibold text-base mb-2">Condition</Text>
        <View className="flex-row gap-3 mb-6">
          {["New", "Used", "Refurbished"].map((cond) => (
            <Pressable
              key={cond}
              onPress={() => setCondition(cond)}
              className={`flex-1 py-3 rounded-2xl ${condition === cond ? "bg-green-500" : "bg-white/5 border border-white/10"}`}
            >
              <Text className={`text-center font-semibold ${condition === cond ? "text-white" : "text-white/60"}`}>
                {cond}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={handleSubmit} className="bg-green-500 py-4 rounded-[60px] mb-10">
          <Text className="text-white text-lg font-semibold text-center">Post Ad</Text>
        </Pressable>
      </LinearGradient>
    </ScrollView>
  )
}

const InputField = ({ label, value, onChangeText, placeholder, multiline = false, keyboardType = "default" }: any) => (
  <View className="mb-4">
    <Text className="text-white font-semibold text-base mb-2">{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#ffffff40"
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
      keyboardType={keyboardType}
      className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white"
      style={{ textAlignVertical: multiline ? "top" : "center" }}
    />
  </View>
)

export default PhonesPost