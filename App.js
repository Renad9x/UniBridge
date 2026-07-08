

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDoc, doc } from "firebase/firestore"; 
import { db } from './firebase';
import { Ionicons } from "@expo/vector-icons";

import { auth } from './firebase';

import LoginScreen from './screens/LoginScreen';
import SigninScreen from './screens/SignupScreen';
import HomeScreenT from './screens/HomeScreenT';
import HomeScreen from './screens/HomeScreenS';
import StudentProfileScreen from './screens/ProfileS';
import UpdateProfileS from "./screens/UpdateProfileS";
import StudentProfileScreenS from "./screens/ProfileSForT";
import TeacherProfileScreen from './screens/ProfileT';
import UpdateProfileT from './screens/UpdateProfileT';
import TeacherProfileScreenT from "./screens/ProfileTForS";
import ChatScreen from './screens/ChatScreen'; 
import SearchScreen from './screens/SearchScreen';
import ChatListScreen from './screens/ChatList';
import Welcome from './screens/Welcom';

const Stack = createNativeStackNavigator();

export default function App() {

  const [user, setUser] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Unsubscribe on component unmount
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        Alert.alert("Logged out", "You have been logged out successfully.");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        Alert.alert("Logout Error", "There was an error logging out.");
      });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator >
        {/* Login and Signup Screens */}
        <Stack.Screen options={{headerShown: false}} name="Welcome" component={Welcome} />
        <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen name='signup' component={SigninScreen}/>

        {/* Home Screens for Teacher and Student */}
        <Stack.Screen options={{headerShown:false}} name='HomeScreenT' component={HomeScreenT} />
        <Stack.Screen name='HomeScreenS' component={HomeScreen} options={{headerShown:false}}/>

        {/* ChatScreen with Role-based Profile Navigation */}
        <Stack.Screen
  name="ChatScreen"
  component={ChatScreen}
  options={({ navigation, route }) => ({
    title: `${route.params?.userName || 'Chat'}`, // Ensure userName exists
    headerRight: () => (
      <TouchableOpacity
        onPress={async () => {
          try {
            const userId = route.params?.userId; // Ensure userId is passed in route.params
            console.log("User ID passed to ChatScreen:", userId); // Debugging log
            if (!userId) {
              Alert.alert("Error", "User ID is missing.");
              return;
            }

            // Fetch the user's role from Firestore
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
              const userRole = userDoc.data().role;
              console.log("Fetched User Role:", userRole); // Debugging log
              if (userRole === "student") {
                navigation.navigate("ProfileSForT", { userId });
              } else if (userRole === "Teacher") {
                navigation.navigate("ProfileTForS", { userId });
              } else {
                Alert.alert("Error", "Unknown user role.");
              }
            } else {
              Alert.alert("Error", "User document not found.");
            }
          } catch (error) {
            console.error("Error fetching user role:", error);
            Alert.alert("Error", "Failed to fetch user role.");
          }
        }}
        style={{ marginRight: 10 }}
      >
        <Ionicons name="alert-circle-outline" size={24} color="black" />
      </TouchableOpacity>
    ),
  })}
/>

        {/* Other Screens */}
        <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name='ProfilS' component={StudentProfileScreen}/>
        <Stack.Screen options={{ title: "Student Profile" }}name="ProfileSForT" component={StudentProfileScreenS} />
        <Stack.Screen name="UpdateProfileS" component={UpdateProfileS} />
        <Stack.Screen name="ProfilT" component={TeacherProfileScreen} />
        <Stack.Screen options={{ title: "Teacher Profile" }} name="ProfileTForS" component={TeacherProfileScreenT} />
        <Stack.Screen name="UpdateProfileT" component={UpdateProfileT} />

        {/* Logout Button */}
        {user && (
          <Stack.Screen
            name="Logout"
            component={() => (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 18}}>Welcome, {user.displayName}</Text>
                <TouchableOpacity onPress={handleLogout} style={{marginTop: 20}}>
                  <Text style={{color: 'red', fontSize: 16}}>Log Out</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  firstView: {
    flex: 1,
    backgroundColor: '#BABDBB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextStyle: {
    color: 'black',
    fontWeight: '300',
    fontSize: 20,
  },
});
