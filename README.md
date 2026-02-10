# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# 🔐 Google Authentication with Firebase (Expo + React Native)

This project uses Firebase Authentication with Google Sign-In implemented via Expo Auth Session.

## Tech Stack

- Expo (React Native)
- Firebase Authentication
- Google Sign-In
- Expo Auth Session
- Firebase SDK

## Prerequisites

- Firebase project created
- Google Authentication enabled in Firebase
- Expo account
- Node.js installed

## Step 1: Enable Google Authentication in Firebase

1. Go to Firebase Console
2. Select your project
3. Navigate to
4. Build → Authentication → Sign-in method
5. Enable Google
6. Click Save

✅ Firebase automatically creates a linked Google Cloud project

## Step 2: Get Google OAuth Web Client ID

1. In Firebase Console
2. Project Settings → General
3. Click Go to Google Cloud Console
4. In Google Cloud Console:
5. Go to APIs & Services → Credentials
6. Open OAuth 2.0 Client IDs
7. Click Web application
8. Copy the Client ID

Example

```bash
  1234567890-abcdefg.apps.googleusercontent.com
   ```
## Step 3: Add Authorized Redirect URI (IMPORTANT)

Inside the same Web OAuth Client:

Add this Redirect URI :

```bash
  [1234567890-abcdefg.apps.googleusercontent.com](https://auth.expo.io/@YOUR_EXPO_USERNAME/YOUR_APP_SLUG)
   ```
Eample 

```bash
  https://auth.expo.io/@ireshchathuranga/bazaaro
   ```

## Step 4: Configure app.json

```bash
  {
  "expo": {
    "name": "bazaaro",
    "slug": "bazaaro",
    "owner": "ireshchathuranga",
    "scheme": "bazaaro"
  }
}
   ```

## Step 5: Environment Variables

Create a .env file:

```bash
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID
  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=YOUR_ANDROID_CLIENT_ID
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=YOUR_IOS_CLIENT_ID
   ```
## Step 6: Install Required Packages

```bash
  npx expo install expo-auth-session
  npx expo install expo-web-browser
  npm install firebase
   ```

## Step 7: Firebase Configuration

services/firebase.ts

```bash
   import { initializeApp } from "firebase/app"
   import { getAuth } from "firebase/auth"
   
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT.appspot.com",
     messagingSenderId: "SENDER_ID",
     appId: "APP_ID",
   }
   
   const app = initializeApp(firebaseConfig)
   export const auth = getAuth(app)
   ```

## Step 8: Google Sign-In Logic (Expo)

```bash
   import * as Google from "expo-auth-session/providers/google"
   import * as WebBrowser from "expo-web-browser"
   import { GoogleAuthProvider, signInWithCredential } from "firebase/auth"
   import { auth } from "@/services/firebase"
   
   WebBrowser.maybeCompleteAuthSession()
   
   const [request, response, promptAsync] = Google.useAuthRequest({
     webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
   })
   
   useEffect(() => {
     if (response?.type === "success") {
       const idToken = response.authentication?.idToken
       const accessToken = response.authentication?.accessToken
   
       const credential = GoogleAuthProvider.credential(idToken, accessToken)
   
       signInWithCredential(auth, credential)
         .then(() => {
           console.log("Google Sign-In Success")
         })
         .catch((error) => {
           console.error("Google Sign-In Error", error)
         })
     }
   }, [response])
   ```

## Step 9: Trigger Google Login

```bash
   <Pressable onPress={() => promptAsync({ useProxy: true })}>
     <Text>Continue with Google</Text>
   </Pressable>
   ```

## Step 10: Restart Expo

```bash
  npx expo start -c
   ```
