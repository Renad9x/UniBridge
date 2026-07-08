import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign'; 

const Welcome = () => {
    const navigation = useNavigation();

    const handleNavigateToLogin = () => {
        navigation.navigate('Login');
    };

    const handleNavigateToPage = () => {
        Linking.openURL('https://youtu.be/8KA-WbdsV5g?si=U338Y28vj383mila');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigateToPage}>
                <Icon name="questioncircleo" size={40} color="#000" style={styles.icon} />
            </TouchableOpacity>

            <Image source={require('../assets/image3.png')} style={styles.image} />

            <Text style={styles.welcomeText1}>Welcome to UniBridge!</Text>
            <Text style={styles.welcomeText}>
                Are you a student looking for guidance from your teachers? Or a teacher wanting to engage with your students?
                {"\n"}This app helps bridge the gap between teachers and students, making communication easy and effective.
            </Text>


            <TouchableOpacity style={styles.button} onPress={handleNavigateToLogin}>
                <Text style={styles.buttonText}>Join Us !</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#B4CBEB',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    icon: {
        position: 'absolute',
        top: -25,
        left: 150, 
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    welcomeText1: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: 'center',
        marginBottom: 30,
        color: '#000',
    },
    welcomeText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 30,
        color: '#000',
    },
    button: {
        backgroundColor: '#1B3C87',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Welcome;
