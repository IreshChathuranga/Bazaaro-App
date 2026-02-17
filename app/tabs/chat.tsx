import React, { useState, useEffect, useContext } from "react"
import { View, Text, Image, Pressable, ScrollView, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import Layout from "@/components/Layout"
import { getUserChats, type Chat } from "@/services/chatService"
import { AuthContext } from "@/context/AuthContext"

const ChatList = () => {
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsubscribe = getUserChats(user.uid, (fetchedChats) => {
      setChats(fetchedChats)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const handleChatPress = (chat: Chat) => {
    const otherUserId = chat.participants.find((id) => id !== user?.uid)
    router.push(`/chat/${chat.id}?otherUserId=${otherUserId}` as any)
  }

  const getOtherUserName = (chat: Chat) => {
    const otherUserId = chat.participants.find((id) => id !== user?.uid)
    return chat.participantNames[otherUserId!] || "Unknown User"
  }

  const getOtherUserPhoto = (chat: Chat) => {
    const otherUserId = chat.participants.find((id) => id !== user?.uid)
    return chat.participantPhotos[otherUserId!] || "https://ui-avatars.com/api/?name=User&background=10b981&color=fff"
  }

  const getUnreadCount = (chat: Chat) => {
    return chat.unreadCount?.[user?.uid || ""] || 0
  }

  const formatTime = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate()
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Layout showTabBar={true}>
      <LinearGradient
        colors={["#0d1812", "#0d1812", "#0d1812"]}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-white text-3xl font-bold">Messages</Text>
          <Text className="text-white/60 text-sm mt-1">
            {chats.length} conversation{chats.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Chat List */}
        <ScrollView className="flex-1 px-4">
          {loading ? (
            <View className="flex-1 justify-center items-center py-20">
              <ActivityIndicator size="large" color="#10b981" />
              <Text className="text-white/60 mt-3 text-sm">Loading chats...</Text>
            </View>
          ) : chats.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <View className="bg-white/5 rounded-full p-6 mb-4">
                <Feather name="message-circle" size={48} color="#10b981" />
              </View>
              <Text className="text-white text-xl font-semibold mb-2">
                No Messages Yet
              </Text>
              <Text className="text-white/50 text-center text-sm px-8">
                Start chatting with sellers by contacting them from product pages
              </Text>
            </View>
          ) : (
            chats.map((chat) => (
              <Pressable
                key={chat.id}
                onPress={() => handleChatPress(chat)}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-3"
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <View className="flex-row items-center">
                  {/* User Avatar */}
                  <Image
                    source={{ uri: getOtherUserPhoto(chat) }}
                    className="w-14 h-14 rounded-full mr-3"
                  />

                  {/* Chat Info */}
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-white font-semibold text-base">
                        {getOtherUserName(chat)}
                      </Text>
                      <Text className="text-white/40 text-xs">
                        {formatTime(chat.lastMessageTime)}
                      </Text>
                    </View>

                    {/* Last Message */}
                    <Text
                      className="text-white/60 text-sm mb-2"
                      numberOfLines={1}
                    >
                      {chat.lastMessageSender === user?.uid ? "You: " : ""}
                      {chat.lastMessage || "Start a conversation"}
                    </Text>

                    {/* Post Info (if exists) */}
                    {chat.postTitle && (
                      <View className="flex-row items-center bg-white/5 rounded-lg p-2 mt-1">
                        {chat.postImage && (
                          <Image
                            source={{ uri: chat.postImage }}
                            className="w-8 h-8 rounded mr-2"
                          />
                        )}
                        <Text
                          className="text-green-500 text-xs font-medium flex-1"
                          numberOfLines={1}
                        >
                          {chat.postTitle}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Unread Badge */}
                  {getUnreadCount(chat) > 0 && (
                    <View className="bg-green-500 rounded-full w-6 h-6 items-center justify-center ml-2">
                      <Text className="text-white text-xs font-bold">
                        {getUnreadCount(chat)}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      </LinearGradient>
    </Layout>
  )
}

export default ChatList