import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, setDoc, serverTimestamp ,updateDoc } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const login = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

export const registerUser = async (
  fullname: string,
  email: string,
  password: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    const user = userCredential.user

    await updateProfile(user, {
      displayName: fullname
    })

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: fullname,
      email: user.email,
      role: "user",
      createdAt: serverTimestamp()
    })

    return user
  } catch (error: any) {
    console.log("REGISTER ERROR:", error.code, error.message)
    throw error
  }
}

export const logoutUser = async () => {
  await signOut(auth)
  AsyncStorage.clear()
  return
}

export const updateUserProfileImage = async (user: any, imageUrl: string) => {
  await updateProfile(user, {
    photoURL: imageUrl,
  })

  const userDocRef = doc(db, "users", user.uid)
  await updateDoc(userDocRef, {
    photoURL: imageUrl,
    updatedAt: new Date()
  })
}
