//Teacher home page

import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, RefreshControl } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ChatListScreen from "./ChatList";
import SearchScreen from "./SearchScreen";
import TeacherProfileScreen from "./ProfileT";

const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Chats List") {
            iconName = "chatbubbles";
          } else if (route.name === "Search") {
            iconName = "search";
          } else if (route.name === "Profile") {
            iconName = "person";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1B3C87",
        tabBarInactiveTintColor: "#b4cbeb",  
      })}
    >
      <Tab.Screen name="Home" component={HomeContent} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Chats List" component={ChatListScreen} />
      <Tab.Screen name="Profile" component={TeacherProfileScreen} />
    </Tab.Navigator>
  );
};

const HomeContent = () => {
  const [name, setName] = useState("");
  const [favoriteTeachers, setFavoriteTeachers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchName();
    fetchFavoriteTeachers();
  }, []);

  const fetchName = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setName(userDoc.data().name);
        } else {
          console.log("No name found");
        }
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  const fetchFavoriteTeachers = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const favoriteQuery = query(
          collection(db, "favorites"),
          where("userId", "==", user.uid),
          where("removed", "==", false)
        );
        const querySnapshot = await getDocs(favoriteQuery);
        const teachers = [];
        for (const favoriteDoc of querySnapshot.docs) {
          const teacherId = favoriteDoc.data().teacherId;
          const teacherDoc = await getDoc(doc(db, "users", teacherId));
          if (teacherDoc.exists()) {
            const teacherData = { ...teacherDoc.data(), id: teacherId };
            teachers.push(teacherData);
          }
        }
        setFavoriteTeachers(teachers);
      }
    } catch (error) {
      console.error("Error fetching favorite teachers:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavoriteTeachers();
    setRefreshing(false);
  };

  const navigateToTeacherProfile = (teacherId, teacherName) => {
    navigation.navigate("ProfileTForS", { userId: teacherId, userName: teacherName });
  };

  return (
    <FlatList
      data={favoriteTeachers}
      ListHeaderComponent={
        <View>
          <Text style={styles.welcomeText}>Welcome, {name}</Text>
          <Text style={styles.favoriteTeachersTitle}>Your Favorite Teachers</Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.teacherItem}
          onPress={() => navigateToTeacherProfile(item.id, item.name)}
        >
          <Text style={styles.teacherName}>{item.name}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={styles.noTeachersText}>No favorite teachers yet.</Text>}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListFooterComponent={
        <Image source={require("../assets/image3.png")} style={styles.image} />
      }
    />
  );
};

const HomeScreenT = () => {
  return <HomeTabNavigator />;
};

export default HomeScreenT;

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#1B3C87",
    textAlign: "center",
    marginVertical: 16,
  },
  favoriteTeachersTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1B3C87",
    textAlign: "center",
  },
  noTeachersText: {
    fontSize: 16,
    color: "#555",
    marginVertical: 16,
    textAlign: "center",
  },
  teacherItem: {
    backgroundColor: "#1B3C87", 
    padding: 10, 
    marginVertical: 5, 
    borderRadius: 5, 
    alignItems: "center",
    width: "90%", 
    alignSelf: "center",
  },
  teacherName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  image: {
    width: 280,
    height: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 20,
  },
});
