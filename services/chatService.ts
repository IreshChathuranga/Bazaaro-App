import { db } from "./firebase"
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from "firebase/firestore"

export interface Message {
  id: string
  chatId: string
  senderId: string
  senderName: string
  text: string
  createdAt: Timestamp
  read: boolean
}

export interface Chat {
  id: string
  participants: string[] // [userId1, userId2]
  participantNames: { [key: string]: string }
  participantPhotos: { [key: string]: string }
  lastMessage: string
  lastMessageTime: Timestamp
  lastMessageSender: string
  postId?: string
  postTitle?: string
  postImage?: string
  unreadCount: { [key: string]: number }
  createdAt: Timestamp
}

// Create or get existing chat between two users
export const createOrGetChat = async (
  currentUserId: string,
  currentUserName: string,
  currentUserPhoto: string,
  otherUserId: string,
  otherUserName: string,
  otherUserPhoto: string,
  postId?: string,
  postTitle?: string,
  postImage?: string
): Promise<string> => {
  try {
    // Create a consistent chat ID regardless of who initiates
    const chatId = [currentUserId, otherUserId].sort().join("_")
    const chatRef = doc(db, "chats", chatId)
    const chatDoc = await getDoc(chatRef)

    if (!chatDoc.exists()) {
      // Create new chat
      await setDoc(chatRef, {
        participants: [currentUserId, otherUserId],
        participantNames: {
          [currentUserId]: currentUserName,
          [otherUserId]: otherUserName
        },
        participantPhotos: {
          [currentUserId]: currentUserPhoto,
          [otherUserId]: otherUserPhoto
        },
        lastMessage: "",
        lastMessageTime: serverTimestamp(),
        lastMessageSender: "",
        postId: postId || null,
        postTitle: postTitle || null,
        postImage: postImage || null,
        unreadCount: {
          [currentUserId]: 0,
          [otherUserId]: 0
        },
        createdAt: serverTimestamp()
      })
    }

    return chatId
  } catch (error) {
    console.error("Error creating/getting chat:", error)
    throw error
  }
}

// Get all chats for a user
export const getUserChats = (userId: string, callback: (chats: Chat[]) => void) => {
  const chatsQuery = query(
    collection(db, "chats"),
    where("participants", "array-contains", userId),
    orderBy("lastMessageTime", "desc")
  )

  return onSnapshot(chatsQuery, (snapshot) => {
    const chats: Chat[] = []
    snapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() } as Chat)
    })
    callback(chats)
  })
}

// Send a message
export const sendMessage = async (
  chatId: string,
  senderId: string,
  senderName: string,
  text: string,
  otherUserId: string
) => {
  try {
    // Add message to messages subcollection
    const messagesRef = collection(db, "chats", chatId, "messages")
    await addDoc(messagesRef, {
      chatId,
      senderId,
      senderName,
      text,
      createdAt: serverTimestamp(),
      read: false
    })

    // Update chat's last message
    const chatRef = doc(db, "chats", chatId)
    const chatDoc = await getDoc(chatRef)
    const chatData = chatDoc.data()

    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageTime: serverTimestamp(),
      lastMessageSender: senderId,
      [`unreadCount.${otherUserId}`]: (chatData?.unreadCount?.[otherUserId] || 0) + 1
    })
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

// Get messages for a chat (real-time)
export const getChatMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  const messagesQuery = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  )

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages: Message[] = []
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as Message)
    })
    callback(messages)
  })
}

// Mark messages as read
export const markMessagesAsRead = async (chatId: string, userId: string) => {
  try {
    const chatRef = doc(db, "chats", chatId)
    await updateDoc(chatRef, {
      [`unreadCount.${userId}`]: 0
    })
  } catch (error) {
    console.error("Error marking messages as read:", error)
  }
}