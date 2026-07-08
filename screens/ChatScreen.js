// Chat Screen
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { auth, db } from "../firebase";
import { addDoc, collection, query, where, orderBy, onSnapshot, getDoc, doc, updateDoc } from "firebase/firestore";

const ChatScreen = ({ route, navigation }) => {
  const { userId, userName } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    if (!currentUserId) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUserId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (msg) =>
            (msg.sender === currentUserId && msg.receiver === userId) ||
            (msg.sender === userId && msg.receiver === currentUserId)
        );

      setMessages(fetchedMessages);

      snapshot.docs.forEach(async (docSnapshot) => {
        const msg = docSnapshot.data();
        if (!msg.isRead && msg.receiver === currentUserId) {
          await updateDoc(doc(db, "chats", docSnapshot.id), { isRead: true });
        }
      });
    });

    return () => unsubscribe();
  }, [currentUserId, userId]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const userDoc = await getDoc(doc(db, "users", currentUserId));
      const senderName = userDoc.exists() ? userDoc.data().name : "Unknown User";

      const newMessage = {
        text: messageText,
        sender: currentUserId,
        senderName,
        receiver: userId,
        receiverName: userName,
        timestamp: new Date(),
        participants: [currentUserId, userId],
        isRead: false, 
      };

      await addDoc(collection(db, "chats"), newMessage);
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === currentUserId ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  const navigateToProfile = async () => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userRole = userDoc.data().role;
      if (userRole === "student") {
        navigation.navigate("ProfileSForT", { userId });
      } else {
        navigation.navigate("ProfileTForS", { userId });
      }
    }
  };

  return (
    <View style={styles.container}>
    

  
    

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
      />

      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={messageText}
        onChangeText={setMessageText}
      />

      <TouchableOpacity style={styles.button} onPress={sendMessage}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  profileIconButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#eceff1",
  },
  messagesList: {
    flexGrow: 1,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "70%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#507DB0",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#1B3C87",
  },
  messageText: {
    color: "white",
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#b4cbeb",
    borderRadius: 4,
    marginBottom: 8,
  },
  button: {
    padding: 12,
    backgroundColor: "#1B3C87",
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ChatScreen;

