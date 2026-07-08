// Search Screen
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { auth, db } from "../firebase";
import { collection, getDocs, setDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [refreshing, setRefreshing] = useState(false); 
  const navigation = useNavigation();
  const currentUserId = auth.currentUser?.uid;

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const filteredUsers = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.role === "Teacher"); 
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const snapshot = await getDocs(collection(db, "favorites"));
      const favoritesMap = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.userId === currentUserId && !data.removed) {
          favoritesMap[data.teacherId] = true;
        }
      });
      setFavorites(favoritesMap);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFavorites();
  }, [currentUserId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUsers(), fetchFavorites()]);
    setRefreshing(false);
  };

  const toggleFavoriteStatus = async (teacherId) => {
    try {
      const favoriteDocRef = doc(db, "favorites", `${currentUserId}_${teacherId}`);
      if (favorites[teacherId]) {
        await setDoc(favoriteDocRef, { removed: true }, { merge: true });
        setFavorites((prev) => ({ ...prev, [teacherId]: false }));
      } else {
        await setDoc(favoriteDocRef, {
          createdAt: Timestamp.fromDate(new Date()),
          removed: false,
          teacherId: teacherId,
          userId: currentUserId,
        });
        setFavorites((prev) => ({ ...prev, [teacherId]: true }));
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  const handleProfileNavigation = (user) => {
    navigation.navigate("ProfileTForS", {
      userId: user.id,
      userName: user.name,
      userDetails: user,
    });
  };

  const handleChatNavigation = (user) => {
    if (!user?.id) {
      console.error("User ID is missing!");
      return;
    }
    navigation.navigate("ChatScreen", {
      userId: user.id,
      userName: user.name,
    });
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a teacher"
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <TouchableOpacity onPress={() => handleProfileNavigation(item)}>
              <Text style={styles.userName}>{item.name}</Text>
            </TouchableOpacity>
            <View style={styles.actionButtons}>
              {/* Favorite Icon */}
              <TouchableOpacity onPress={() => toggleFavoriteStatus(item.id)}>
                <Ionicons
                  name={favorites[item.id] ? "heart" : "heart-outline"}
                  size={24}
                  color={favorites[item.id] ? "red" : "black"}
                />
              </TouchableOpacity>

              {/* Chat Icon */}
              <TouchableOpacity onPress={() => handleChatNavigation(item)}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#1B3C87" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyListText}>No teachers found</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: "#1B3C87",
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#b4cbeb",
    marginBottom: 15,
    borderRadius: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 15,
  },
  emptyListText: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
});

