'use client';

import { useRouter, type Href } from "expo-router";
import React, { ReactNode, useState } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LayoutProps = {
  children?: ReactNode;
  showTabBar?: boolean; // New prop to control tab bar visibility
};

const Layout = ({ children, showTabBar = true }: LayoutProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");

  const navigate = (tab: string, path: Href) => {
    setActiveTab(tab);
    router.push(path);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Scrollable content */}
      <ScrollView 
        contentContainerStyle={[
          styles.content,
          !showTabBar && { paddingBottom: 20 } // Less padding if no tab bar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {/* Bottom Navigation - Only show if showTabBar is true */}
      {showTabBar && (
        <View style={styles.bottomNavContainer}>
          <Pressable style={styles.navItem} onPress={() => navigate("home", "/tabs/dashboard")}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={[styles.navLabel, activeTab === "home" && styles.activeLabel]}>Home</Text>
          </Pressable>

          <Pressable style={styles.navItem} onPress={() => navigate("search", "/tabs/search")}>
            <Text style={styles.navIcon}>🔍</Text>
            <Text style={[styles.navLabel, activeTab === "search" && styles.activeLabel]}>Search</Text>
          </Pressable>

          <Pressable style={styles.postButton} onPress={() => navigate("post", "/tabs/post")}>
            <Text style={styles.postIcon}>+</Text>
            <Text style={[styles.navLabel, activeTab === "post" && styles.activeLabel]}>Post Ad</Text>
          </Pressable>

          <Pressable style={styles.navItem} onPress={() => navigate("chat", "/tabs/chat")}>
            <Text style={styles.navIcon}>💬</Text>
            <Text style={[styles.navLabel, activeTab === "chat" && styles.activeLabel]}>Chat</Text>
          </Pressable>

          <Pressable style={styles.navItem} onPress={() => navigate("account", "/tabs/profile")}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={[styles.navLabel, activeTab === "account" && styles.activeLabel]}>Account</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  content: {
    paddingBottom: 90,
    flexGrow: 1,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    backgroundColor: "#fff",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navItem: { 
    alignItems: "center",
    padding: 8,
  },
  navIcon: { 
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: { 
    fontSize: 11, 
    color: "#6b7280",
    fontWeight: "500",
  },
  activeLabel: { 
    color: "#10b981", 
    fontWeight: "bold" 
  },
  postButton: { 
    alignItems: "center", 
    justifyContent: "center",
    marginTop: -10,
  },
  postIcon: {
    fontSize: 32,
    fontWeight: "bold",
    backgroundColor: "#10b981",
    width: 56,
    height: 56,
    textAlign: "center",
    lineHeight: 56,
    borderRadius: 28,
    color: "#fff",
    marginBottom: 4,
    elevation: 4,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default Layout;