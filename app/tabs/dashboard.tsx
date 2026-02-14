import React from "react";
import Layout from "@/components/Layout";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

const Dashboard = () => {
  return (
    <Layout>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.greetingText}>Good Morning,</Text>
          <Text style={styles.userName}>Iresh 👋</Text>
        </View>
        <Pressable style={styles.profileButton}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=3" }} // Example profile image
            style={styles.profileImage}
          />
        </Pressable>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to your dashboard!</Text>
        {/* Add cards, stats, or other dashboard components here */}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#10b981", // Green header background
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greetingText: {
    color: "#d1fae5",
    fontSize: 16,
    fontWeight: "500",
  },
  userName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 2,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
});

export default Dashboard;
