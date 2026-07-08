import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const ChatListScreen = ({ navigation }) => {
  const [chatList, setChatList] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State to handle refreshing
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    if (!currentUserId) return;

    const fetchChats = () => {
      const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", currentUserId)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map((doc) => {
          const data = doc.data();
          const otherParticipant =
            data.sender === currentUserId ? data.receiver : data.sender;
          const otherName =
            data.sender === currentUserId ? data.receiverName : data.senderName;

          // Calculate unread messages
          const unreadMessages = snapshot.docs.filter(
            (msgDoc) =>
              msgDoc.data().receiver === currentUserId &&
              msgDoc.data().sender === otherParticipant &&
              !msgDoc.data().isRead
          );

          return {
            id: doc.id,
            ...data,
            otherParticipant,
            otherName,
            unreadCount: unreadMessages.length,
          };
        });

        // Remove duplicates based on otherParticipant
        const uniqueChats = Array.from(
          new Map(chats.map((item) => [item.otherParticipant, item])).values()
        );
        setChatList(uniqueChats);

        // Check for unread messages
        const hasUnreadMessages = uniqueChats.some(
          (chat) => chat.unreadCount > 0
        );

        // Update badge in the tab
        navigation.setOptions({
          tabBarBadge: hasUnreadMessages ? "!" : null, // Display a badge if there are unread messages
        });
      });

      return unsubscribe;
    };

    const unsubscribe = fetchChats();

    return () => unsubscribe();
  }, [currentUserId, navigation]);

  // Refresh function to reload the chat list
  const onRefresh = async () => {
    setRefreshing(true); // Show refresh indicator
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay
    setRefreshing(false); // Hide refresh indicator
  };

  const navigateToChat = (chat) => {
    navigation.navigate("ChatScreen", {
      userId: chat.otherParticipant,
      userName: chat.otherName,
    });
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => navigateToChat(item)}>
      <Text style={styles.chatName}>{item.otherName}</Text>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.chatList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  chatList: {
    padding: 16,
  },
  chatItem: {
    padding: 16,
    backgroundColor: "#1B3C87",
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatName: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  unreadBadge: {
    backgroundColor: "red",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unreadText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ChatListScreen;