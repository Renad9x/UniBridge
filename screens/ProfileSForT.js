// Student profile for users
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { useRoute } from "@react-navigation/native";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const StudentProfileScreen = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const route = useRoute();
  const { userId, userName } = route.params; 

  const fetchProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId)); 
      if (userDoc.exists()) {
        setProfile(userDoc.data());
      } else {
        setError("No profile found.");
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError("Failed to fetch profile data.");
    } finally {
      setLoading(false); 
      setRefreshing(false); 
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true); 
    fetchProfile(); 
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* main information */}
      <View style={styles.section1}>
        <Text style={styles.name}>{profile.name || userName || "Unknown Name"}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Academic Rank:</Text>
          <Text style={styles.value}>{profile.AcademicRank || "Not set"}</Text>

          <Text style={styles.label}>Academic Specialization:</Text>
          <Text style={styles.value}>{profile.AcademicSpecialization || "Not set"}</Text>

          <Text style={styles.label}>Level:</Text>
          <Text style={styles.value}>{profile.Level || "Not set"}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profile.Email || "Not set"}</Text>
        </View>
      </View>

      {/* more information */}
      <View style={styles.section2}>
        <Text style={styles.label}>Introduction/Brief CV:</Text>
        <Text style={styles.value}>{profile.Cv || "Not set"}</Text>
        <Text style={styles.label}>Expertise:</Text>
        <Text style={styles.value}>{profile.Expertise || "Not set"}</Text>
        <Text style={styles.label}>Publications:</Text>
        <Text style={styles.value}>{profile.Publications || "Not set"}</Text>
      </View>
    </ScrollView>
  );
};

export default StudentProfileScreen;

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});