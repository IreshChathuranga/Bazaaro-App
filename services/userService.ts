import { db, auth } from "./firebase"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"

export interface UserProfile {
  uid: string
  name: string
  email: string
  photoURL?: string
  phone?: string
  mobile?: string
  address?: string
  bio?: string
  role: string
  createdAt: any
  updatedAt?: any
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

export const changeUserEmail = async (newEmail: string, currentPassword: string) => {
  try {
    const user = auth.currentUser
    if (!user || !user.email) throw new Error("No user logged in")

    // Reauthenticate user
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    await reauthenticateWithCredential(user, credential)

    // Update email in Firebase Auth
    await updateEmail(user, newEmail)

    // Update email in Firestore
    await updateDoc(doc(db, "users", user.uid), {
      email: newEmail,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error("Error changing email:", error)
    throw error
  }
}

export const changeUserPassword = async (currentPassword: string, newPassword: string) => {
  try {
    const user = auth.currentUser
    if (!user || !user.email) throw new Error("No user logged in")

    // Reauthenticate user
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    await reauthenticateWithCredential(user, credential)

    // Update password
    await updatePassword(user, newPassword)
  } catch (error) {
    console.error("Error changing password:", error)
    throw error
  }
}