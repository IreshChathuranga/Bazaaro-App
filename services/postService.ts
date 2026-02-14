import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore"
import { db } from "./firebase"

export interface PostData {
  userId: string
  userName: string
  userEmail: string
  category: string
  title: string
  description: string
  price: number
  images: string[]
  // Car-specific fields
  brand?: string
  model?: string
  year?: number
  mileage?: number
  condition?: string
  // Phone-specific fields
  storage?: string
  ram?: string
  // Property-specific fields
  bedrooms?: number
  bathrooms?: number
  sqft?: number
  location?: string
  // General fields
  status: "active" | "sold" | "inactive"
  views: number
  createdAt: any
}

export type PostWithId = PostData & { id: string }

export const createPost = async (postData: PostData) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating post:", error)
    throw error
  }
}

export const getUserPosts = async (userId: string): Promise<PostWithId[]> => {
  try {
    const q = query(collection(db, "posts"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as PostData) }))
  } catch (error) {
    console.error("Error fetching user posts:", error)
    throw error
  }
}

export const getUserPostsByCategory = async (userId: string, category: string): Promise<PostWithId[]> => {
  try {
    const q = query(
      collection(db, "posts"), 
      where("userId", "==", userId),
      where("category", "==", category)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as PostData) }))
  } catch (error) {
    console.error("Error fetching user posts by category:", error)
    throw error
  }
}

export const getPostById = async (postId: string): Promise<PostWithId | null> => {
  try {
    const docRef = doc(db, "posts", postId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as PostData) }
    }
    return null
  } catch (error) {
    console.error("Error fetching post:", error)
    throw error
  }
}

export const updatePost = async (postId: string, postData: Partial<PostData>) => {
  try {
    const docRef = doc(db, "posts", postId)
    await updateDoc(docRef, {
      ...postData,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating post:", error)
    throw error
  }
}

export const deletePost = async (postId: string) => {
  try {
    const docRef = doc(db, "posts", postId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error("Error deleting post:", error)
    throw error
  }
}

export const getCategoryPostCounts = async (userId: string) => {
  try {
    const q = query(collection(db, "posts"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    
    const counts: Record<string, number> = {}
    querySnapshot.docs.forEach(doc => {
      const category = doc.data().category
      counts[category] = (counts[category] || 0) + 1
    })
    
    return counts
  } catch (error) {
    console.error("Error fetching category counts:", error)
    throw error
  }
}