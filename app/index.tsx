import { View, Animated, Image, Dimensions } from "react-native"
import { useEffect, useRef } from "react"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins"

export default function Index() {
  const router = useRouter()
  const shineAnim = useRef(new Animated.Value(-1)).current
  const { width } = Dimensions.get("window")

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  })

  useEffect(() => {
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      })
    ).start()

    const timer = setTimeout(() => {
      router.replace("/auth/login")
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  if (!fontsLoaded) return null

  const translateX = shineAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width],
  })

  return (
    <LinearGradient
      colors={["#ffffff", "#ffffff", "#ffffff"]}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={{ width: 300, height: 160, overflow: "hidden" }}>
        {/* Logo */}
        <Image
          source={require("../assets/bazaaro.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />

        {/* Shine effect */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 120,
            height: "100%",
            transform: [{ translateX }],
          }}
        >
          <LinearGradient
            colors={[
              "transparent",
              "rgba(255,255,255,0.6)",
              "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>
    </LinearGradient>
  )
}
