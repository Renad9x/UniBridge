// Log in screen
import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from "react"
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from "react-native"
import { auth } from "../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";


const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()

    const handleLogin = async () => {

        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredentials.user;
            console.log('Logged in with:', user.email);
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userRole = userData.role;

                if (userRole == "student") {
                    navigation.navigate("HomeScreenS");

                } else if (userRole == "Teacher") {
                    navigation.navigate("HomeScreenT");
                }
            } else {
                console.error("no user found");
            }
        }
        catch (error) { alert(error.message) }
    }

    const handleForgotPassword = async () => {
        if (!email) {
            alert("Please enter your email address first then click in the button again!");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert("we send you an email for reset your password");
        } catch (error) {
            alert(error.message);
        }
    };
    

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding">
            <View style={styles.inputContainer}>
                <Text style={{ fontSize: 30, color: '#1B3C87' }}>Welcom Back!</Text>
                <Text>enter your email:</Text>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input} />
                <Text>enter your password:</Text>
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("signup")}
                    style={[styles.button, styles.buttonOutline]}>
                    <Text style={styles.buttonOutlineText}>you dont have account? Register Now!</Text>

                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleForgotPassword}>
                <Text style={{ color: '#1B3C87', fontWeight: 'bold' }}>Forgot Password?</Text>
                </TouchableOpacity>

                <Image source={require('../assets/image3.png')} style={styles.image} />

            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40

    },

    inputContainer: {
        width: '80%'
    },

    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },

    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    button: {
        backgroundColor: '#1B3C87',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },

    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },

    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#1B3C8',
        borderWidth: 2,
        marginBottom: 10
    },

    buttonOutlineText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '700',
    },
    image: {
        bottom: 0,
        right: 0,
        width: 280,
        height: 280,
        resizeMode: 'contain',
    }
})