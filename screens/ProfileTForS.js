import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db } from "../firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { auth } from "../firebase";
import { Ionicons } from "@expo/vector-icons";

const TeacherProfileScreen = () => {
  const [profile, setProfile] = useState({});
  const [isFavorited, setIsFavorited] = useState(false);
  const [refreshing, setRefreshing] = useState(false); 
  const route = useRoute();
  const { userId, userName } = route.params;
  const navigation = useNavigation();
  const currentUserId = auth.currentUser?.uid;

  const fetchProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setProfile(userDoc.data());
      } else {
        console.log("No profile found");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const checkIfFavorited = async () => {
    try {
      const favoriteDocRef = doc(db, "favorites", `${currentUserId}_${userId}`);
      const favoriteDoc = await getDoc(favoriteDocRef);
      if (favoriteDoc.exists() && !favoriteDoc.data().removed) {
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true); 
    fetchProfile().then(() => setRefreshing(false));
    checkIfFavorited().then(() => setRefreshing(false)); 
  };

  useEffect(() => {
    fetchProfile();
    checkIfFavorited();
  }, [userId, currentUserId]);

  const toggleFavoriteStatus = async () => {
    try {
      const favoriteDocRef = doc(db, "favorites", `${currentUserId}_${userId}`);
      if (isFavorited) {
        await setDoc(favoriteDocRef, { removed: true }, { merge: true });
        setIsFavorited(false);
        console.log("Teacher removed from favorites successfully!");
      } else {
        await setDoc(favoriteDocRef, {
          createdAt: Timestamp.fromDate(new Date()),
          removed: false,
          teacherId: userId,
          userId: currentUserId,
        });
        setIsFavorited(true);
        console.log("Teacher added to favorites successfully!");
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  const navigateToChatScreen = () => {
    navigation.navigate("ChatScreen", {
      userId: userId,
      userName: userName,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.section1}>
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{profile.name || userName || "Unknown Name"}</Text>
          <TouchableOpacity onPress={toggleFavoriteStatus}>
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={30}
              color={isFavorited ? "red" : "black"}
              style={styles.heartIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Academic Rank:</Text>
          <Text style={styles.value}>{profile.AcademicRank || "Not set"}</Text>
          <Text style={styles.label}>Professional Designation:</Text>
          <Text style={styles.value}>{profile.Professionaldesignation || "Not set"}</Text>
          <Text style={styles.label}>Academic Specialization:</Text>
          <Text style={styles.value}>{profile.AcademicSpecialization || "Not set"}</Text>
          <Text style={styles.label}>Workplace:</Text>
          <Text style={styles.value}>{profile.Workplace || "Not set"}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profile.Email || "Not set"}</Text>
        </View>
      </View>

      <View style={styles.section2}>
        <Text style={styles.label}>Introduction/Brief CV:</Text>
        <Text style={styles.value}>{profile.Cv || "Not set"}</Text>
        <Text style={styles.label}>Expertise:</Text>
        <Text style={styles.value}>{profile.Expertise || "Not set"}</Text>
        <Text style={styles.label}>Publications:</Text>
        <Text style={styles.value}>{profile.Publications || "Not set"}</Text>
        <Text style={styles.label}>Courses:</Text>
        <Text style={styles.value}>{profile.Courses || "Not set"}</Text>
        <Text style={styles.label}>Office Hours:</Text>
        <Text style={styles.value}>{profile.OfficeHours || "Not set"}</Text>
        <Text style={styles.label}>Office Phone:</Text>
        <Text style={styles.value}>{profile.officePhone || "Not set"}</Text>
        <Text style={styles.label}>Office Number:</Text>
        <Text style={styles.value}>{profile.officeNumber || "Not set"}</Text>
      </View>

      {/* Start Chat button */}
      <TouchableOpacity style={styles.chatButton} onPress={navigateToChatScreen}>
        <Text style={styles.chatButtonText}>Start Chat</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TeacherProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  section1: {
    backgroundColor: "#b4cbeb",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  section2: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heartIcon: {
    marginLeft: 10,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
    color: "#666",
  },
  chatButton: {
    height: 50,
    backgroundColor: "#1B3C87",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  chatButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});