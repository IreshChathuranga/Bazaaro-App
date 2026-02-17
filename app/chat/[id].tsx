import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Image } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import { getChatMessages, sendMessage, markMessagesAsRead, type Message } from "@/services/chatService"
import { getUserProfile } from "@/services/userService"
import { AuthContext } from "@/context/AuthContext"

const ChatScreen = () => {
  const router = useRouter()
  const { id, otherUserId } = useLocalSearchParams()
  const { user } = useContext(AuthContext)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [otherUserName, setOtherUserName] = useState("")
  const [otherUserPhoto, setOtherUserPhoto] = useState("")
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (!id || !user) return

    const chatId = Array.isArray(id) ? id[0] : id

    // Mark messages as read
    markMessagesAsRead(chatId, user.uid)

    // Listen to messages
    const unsubscribe = getChatMessages(chatId, (fetchedMessages) => {
      setMessages(fetchedMessages)
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100)
    })

    return () => unsubscribe()
  }, [id, user])

  useEffect(() => {
    if (otherUserId) {
      loadOtherUser()
    }
  }, [otherUserId])

  const loadOtherUser = async () => {
    try {
      const userId = Array.isArray(otherUserId) ? otherUserId[0] : otherUserId
      const profile = await getUserProfile(userId)
      if (profile) {
        setOtherUserName(profile.name)
        setOtherUserPhoto(profile.photoURL || "")
      }
    } catch (error) {
      console.error("Error loading other user:", error)
    }
  }

  const handleSend = async () => {
    if (!messageText.trim() || !user || !id) return

    const chatId = Array.isArray(id) ? id[0] : id
    const otherId = Array.isArray(otherUserId) ? otherUserId[0] : otherUserId

    try {
      await sendMessage(
        chatId,
        user.uid,
        user.displayName || "Unknown",
        messageText.trim(),
        otherId as string
      )
      setMessageText("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const formatTime = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate()
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#0d1812]"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <LinearGradient
        colors={["#0d1812", "#0d1812", "#0d1812"]}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center px-4 pt-12 pb-4 border-b border-white/10">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center mr-3"
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </Pressable>

          <Image
            source={{ uri: otherUserPhoto || "https://ui-avatars.com/api/?name=User&background=10b981&color=fff" }}
            className="w-10 h-10 rounded-full mr-3"
          />

          <View className="flex-1">
            <Text className="text-white font-semibold text-lg">
              {otherUserName || "Loading..."}
            </Text>
            <Text className="text-white/50 text-xs">Online</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((message) => {
            const isMyMessage = message.senderId === user?.uid

            return (
              <View
                key={message.id}
                className={`mb-3 flex-row ${isMyMessage ? "justify-end" : "justify-start"}`}
              >
                <View
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isMyMessage
                      ? "bg-green-500"
                      : "bg-white/10"
                  }`}
                >
                  <Text className="text-white text-base mb-1">
                    {message.text}
                  </Text>
                  <Text
                    className={`text-xs ${
                      isMyMessage ? "text-white/70" : "text-white/50"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </Text>
                </View>
              </View>
            )
          })}
        </ScrollView>

        {/* Input */}
        <View className="flex-row items-center px-4 py-3 border-t border-white/10 bg-[#0a110d]">
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message..."
            placeholderTextColor="#ffffff60"
            className="flex-1 bg-white/10 rounded-full px-4 py-3 text-white mr-2"
            multiline
            maxLength={500}
          />
          <Pressable
            onPress={handleSend}
            disabled={!messageText.trim()}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              messageText.trim() ? "bg-green-500" : "bg-white/10"
            }`}
          >
            <Feather name="send" size={20} color="#fff" />
          </Pressable>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

export default ChatScreen