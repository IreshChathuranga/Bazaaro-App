// import { View, Text, Pressable, ScrollView, TextInput, FlatList } from "react-native"
// import React, { useState } from "react"
// import { useRouter } from "expo-router"

// const Chat = () => {
//   const router = useRouter()
//   const [activeTab, setActiveTab] = useState("chat")
//   const [selectedChat, setSelectedChat] = useState(null)
//   const [messageText, setMessageText] = useState("")

//   const conversations = [
//     {
//       id: 1,
//       name: "Ahmed Khan",
//       lastMessage: "Is this item still available?",
//       avatar: "👨",
//       unread: 2,
//       timestamp: "2 min",
//       item: "Ashok Leyland Tusker",
//     },
//     {
//       id: 2,
//       name: "Fatima Hassan",
//       lastMessage: "Thanks, I'll take it!",
//       avatar: "👩",
//       unread: 0,
//       timestamp: "1 hour",
//       item: "iPhone 14 Pro",
//     },
//     {
//       id: 3,
//       name: "Ravi Perera",
//       lastMessage: "Can you negotiate on price?",
//       avatar: "👨",
//       unread: 1,
//       timestamp: "3 hours",
//       item: "Sofa Set",
//     },
//     {
//       id: 4,
//       name: "Suhani Silva",
//       lastMessage: "When can we meet?",
//       avatar: "👩",
//       unread: 0,
//       timestamp: "5 hours",
//       item: "Laptop",
//     },
//   ]

//   const messages = [
//     { id: 1, sender: "Ahmed Khan", text: "Hi, is this item still available?", timestamp: "2:30 PM", isSender: false },
//     { id: 2, sender: "You", text: "Yes, it is! Interested?", timestamp: "2:32 PM", isSender: true },
//     { id: 3, sender: "Ahmed Khan", text: "Is this item still available?", timestamp: "2:35 PM", isSender: false },
//   ]

//   const renderConversation = ({ item }) => (
//     <Pressable
//       onPress={() => setSelectedChat(item)}
//       className={`flex-row items-center px-4 py-3 border-b border-gray-200 ${
//         selectedChat?.id === item.id ? "bg-orange-50" : "bg-white"
//       }`}
//     >
//       <Text className="text-4xl mr-3">{item.avatar}</Text>
//       <View className="flex-1">
//         <View className="flex-row justify-between items-center mb-1">
//           <Text className="text-base font-bold text-gray-800">{item.name}</Text>
//           <Text className="text-xs text-gray-500">{item.timestamp}</Text>
//         </View>
//         <Text className="text-sm text-gray-600 mb-1">{item.item}</Text>
//         <Text className="text-sm text-gray-500" numberOfLines={1}>
//           {item.lastMessage}
//         </Text>
//       </View>
//       {item.unread > 0 && (
//         <View className="bg-orange-600 rounded-full w-6 h-6 justify-center items-center ml-2">
//           <Text className="text-white text-xs font-bold">{item.unread}</Text>
//         </View>
//       )}
//     </Pressable>
//   )

//   const renderMessage = ({ item }) => (
//     <View
//       className={`flex-row mb-3 ${item.isSender ? "justify-end" : "justify-start"}`}
//     >
//       <View
//         className={`max-w-xs px-4 py-2 rounded-2xl ${
//           item.isSender
//             ? "bg-orange-600 rounded-br-none"
//             : "bg-gray-200 rounded-bl-none"
//         }`}
//       >
//         <Text
//           className={`${
//             item.isSender ? "text-white" : "text-gray-800"
//           } text-sm`}
//         >
//           {item.text}
//         </Text>
//         <Text
//           className={`text-xs mt-1 ${
//             item.isSender ? "text-orange-100" : "text-gray-500"
//           }`}
//         >
//           {item.timestamp}
//         </Text>
//       </View>
//     </View>
//   )

//   return (
//     <View className="flex-1 bg-gray-100">
//       {selectedChat ? (
//         // Chat View
//         <View className="flex-1 bg-white">
//           {/* Header */}
//           <View className="bg-orange-600 px-4 py-3 flex-row items-center justify-between">
//             <Pressable
//               onPress={() => setSelectedChat(null)}
//               className="flex-row items-center"
//             >
//               <Text className="text-white text-2xl mr-3">←</Text>
//               <View>
//                 <Text className="text-white font-bold">{selectedChat.name}</Text>
//                 <Text className="text-orange-100 text-xs">{selectedChat.item}</Text>
//               </View>
//             </Pressable>
//             <Text className="text-2xl">⋯</Text>
//           </View>

//           {/* Messages */}
//           <FlatList
//             data={messages}
//             renderItem={renderMessage}
//             keyExtractor={(item) => item.id.toString()}
//             contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 12 }}
//             inverted
//           />

//           {/* Input */}
//           <View className="border-t border-gray-200 flex-row items-center px-3 py-3 gap-2 bg-white">
//             <TextInput
//               placeholder="Type a message..."
//               value={messageText}
//               onChangeText={setMessageText}
//               className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-800"
//               placeholderTextColor="#999"
//             />
//             <Pressable className="bg-orange-600 rounded-full w-10 h-10 justify-center items-center">
//               <Text className="text-white text-lg">→</Text>
//             </Pressable>
//           </View>
//         </View>
//       ) : (
//         // Conversations List
//         <View className="flex-1">
//           {/* Header */}
//           <View className="bg-orange-600 px-4 py-4">
//             <Text className="text-white text-2xl font-bold mb-3">Messages</Text>
//             <TextInput
//               placeholder="Search conversations..."
//               className="bg-white rounded-full px-4 py-2"
//               placeholderTextColor="#999"
//             />
//           </View>

//           {/* Conversations List */}
//           <FlatList
//             data={conversations}
//             renderItem={renderConversation}
//             keyExtractor={(item) => item.id.toString()}
//             scrollEnabled={true}
//             contentContainerStyle={{ paddingBottom: 80 }}
//           />
//         </View>
//       )}

//       {/* Bottom Navigation */}
//       <View className="bg-white border-t border-gray-300 flex-row justify-around items-center py-3 absolute bottom-0 left-0 right-0">
//         <Pressable className="items-center" onPress={() => router.push("/home")}>
//           <Text className="text-2xl mb-1">🏠</Text>
//           <Text className="text-gray-600 text-xs">Home</Text>
//         </Pressable>

//         <Pressable className="items-center" onPress={() => router.push("/search")}>
//           <Text className="text-2xl mb-1">🔍</Text>
//           <Text className="text-gray-600 text-xs">Search</Text>
//         </Pressable>

//         <Pressable className="items-center" onPress={() => router.push("/post-ad")}>
//           <View className="bg-yellow-400 rounded-full w-12 h-12 justify-center items-center mb-1 border-4 border-white shadow-lg">
//             <Text className="text-white text-2xl font-bold">+</Text>
//           </View>
//           <Text className="text-gray-600 text-xs">Post ad</Text>
//         </Pressable>

//         <Pressable className="items-center">
//           <Text className="text-2xl mb-1">💬</Text>
//           <Text className={activeTab === "chat" ? "text-green-600 font-bold text-xs" : "text-gray-600 text-xs"}>
//             Chat
//           </Text>
//         </Pressable>

//         <Pressable className="items-center" onPress={() => router.push("/account")}>
//           <Text className="text-2xl mb-1">👤</Text>
//           <Text className="text-gray-600 text-xs">Account</Text>
//         </Pressable>
//       </View>
//     </View>
//   )
// }

// export default Chat
