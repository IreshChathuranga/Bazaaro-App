import React, { useContext, useState, useEffect, useCallback } from "react"
import { View, Text, Pressable, ScrollView, TextInput, Image, ActivityIndicator } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import { AuthContext } from "@/context/AuthContext"
import Toast from "react-native-toast-message"
import * as ImagePicker from "expo-image-picker"
import { uploadImageToCloudinary } from "@/services/cloudinaryService"
import { getPostById, updatePost } from "@/services/postService"
import { useLoader } from "@/hooks/useLoader"

const EditPost = () => {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { user } = useContext(AuthContext)
  const { showLoader, hideLoader } = useLoader()

  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [mileage, setMileage] = useState("")
  const [condition, setCondition] = useState("Used")
  const [images, setImages] = useState<string[]>([])

  const loadPost = useCallback(async () => {
    if (!id) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Invalid post ID",
        position: "top",
        visibilityTime: 3000,
      })
      router.back()
      return
    }

    try {
      const postId = Array.isArray(id) ? id[0] : id
      const post = await getPostById(postId)

      if (post) {
        setTitle(post.title || "")
        setDescription(post.description || "")
        setPrice(post.price?.toString() || "")
        setBrand(post.brand || "")
        setModel(post.model || "")
        setYear(post.year?.toString() || "")
        setMileage(post.mileage?.toString() || "")
        setCondition(post.condition || "Used")
        setImages(post.images || [])
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Post not found",
          position: "top",
          visibilityTime: 3000,
        })
        router.back()
      }
    } catch (error) {
      console.error("Error loading post:", error)
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not load post",
        position: "top",
        visibilityTime: 3000,
      })
      router.back()
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    loadPost()
  }, [loadPost])

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
    if (!title || !description || !price) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please fill all required fields",
        position: "top",
        visibilityTime: 3000,
      })
      return
    }

    if (images.length === 0) {
      Toast.show({
        type: "error",
        text1: "Missing Image",
        text2: "Please add at least one image",
        position: "top",
        visibilityTime: 3000,
      })
      return
    }

    try {
      showLoader()
      const postId = Array.isArray(id) ? id[0] : id
      await updatePost(postId as string, {
        title,
        description,
        price: parseFloat(price),
        images,
        brand,
        model,
        year: year ? parseInt(year) : undefined,
        mileage: mileage ? parseInt(mileage) : undefined,
        condition,
      } as any)
      hideLoader()
      Toast.show({
        type: "success",
        text1: "Success! 🎉",
        text2: "Post updated successfully",
        position: "top",
        visibilityTime: 2000,
      })
      setTimeout(() => router.back(), 1000)
    } catch (error) {
      hideLoader()
      console.error("Update error:", error)
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Could not update post",
        position: "top",
        visibilityTime: 3000,
      })
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d1812" }}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading post...</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        colors={["#0d1812", "#0d1812", "#0d1812", "#0d1812"]}
        className="flex-1 px-6 pt-10"
      >
        <Pressable
          onPress={() => router.back()}
          className="border border-white rounded-[60px] px-3 py-5 mb-6"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-2xl font-semibold">
              Edit Post
            </Text>
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
              <Feather name="arrow-left" size={26} color="#ffffff" />
            </View>
          </View>
        </Pressable>

        <Text className="text-white font-semibold text-lg mb-3">Photos</Text>
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
          <Pressable
            onPress={() => pickImage(false)}
            className="w-24 h-24 bg-white/5 border border-white/10 rounded-2xl items-center justify-center"
          >
            <Feather name="image" size={28} color="#10b981" />
            <Text className="text-white/60 text-xs mt-1">Gallery</Text>
          </Pressable>
          <Pressable
            onPress={() => pickImage(true)}
            className="w-24 h-24 bg-white/5 border border-white/10 rounded-2xl items-center justify-center"
          >
            <Feather name="camera" size={28} color="#10b981" />
            <Text className="text-white/60 text-xs mt-1">Camera</Text>
          </Pressable>
        </View>

        <InputField label="Title" value={title} onChangeText={setTitle} placeholder="e.g., Toyota Camry 2020" />
        <InputField label="Description" value={description} onChangeText={setDescription} placeholder="Describe your car..." multiline />
        <InputField label="Price (LKR)" value={price} onChangeText={setPrice} placeholder="e.g., 5000000" keyboardType="numeric" />
        <InputField label="Brand" value={brand} onChangeText={setBrand} placeholder="e.g., Toyota" />
        <InputField label="Model" value={model} onChangeText={setModel} placeholder="e.g., Camry" />
        <InputField label="Year" value={year} onChangeText={setYear} placeholder="e.g., 2020" keyboardType="numeric" />
        <InputField label="Mileage (km)" value={mileage} onChangeText={setMileage} placeholder="e.g., 50000" keyboardType="numeric" />

        <Text className="text-white font-semibold text-base mb-2">Condition</Text>
        <View className="flex-row gap-3 mb-6">
          {["New", "Used", "Reconditioned"].map((cond) => (
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
          <Text className="text-white text-lg font-semibold text-center">Update Post</Text>
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

export default EditPost