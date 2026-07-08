// Register screen
import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from "react"
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, Picker } from "react-native"
import { auth } from "../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const SigninScreen = () => {
    const [role, setRole] = useState("");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()

    const handleSignUp = async () => {
        if (!role) {
            Alert.alert("dont forget to select Student or teacher");
            return;
        }
        if (!name) {
            Alert.alert("enter your name pleas");
            return;
        }
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredentials.user;

            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: user.email,
                role: role,
            });

            if (role == "student") {
                navigation.replace("HomeScreenS");
            } else if (role == "Teacher") {
                navigation.replace("HomeScreenT");
            }

        } catch (error) {
            alert(error.message);
        }
    }
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding">
            <View style={styles.inputContainer}>
                <Text style={{ fontSize: 30, color: '#1B3C87' }}>Welcom to our app!</Text>
                <Text>enter your Name:</Text>
                <TextInput
                    placeholder="Name"
                    value={name}
                    onChangeText={text => setName(text)}

                    style={styles.input} />

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
            <View style={styles.Rcontainer}>
                <Text style={{ marginBottom: 10 }}>you are a?</Text>

                <TouchableOpacity style={[styles.Rbutton, role === "student" && styles.selectedRole]}
                    onPress={() => setRole("student")}>
                    <Text style={styles.Rtext}>Student</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.Rbutton, role === "Teacher" && styles.selectedRole]}
                    onPress={() => setRole("Teacher")}>
                    <Text style={styles.Rtext}>Teacher</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleSignUp}
                    style={[styles.button, styles.buttonOutline]}>
                    <Text style={styles.buttonOutlineText}>Register</Text>

                </TouchableOpacity>
                <Image source={require('../assets/image3.png')} style={styles.image} />

            </View>
        </KeyboardAvoidingView>
    )
}

export default SigninScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 25
    },

    inputContainer: {
        width: '100%'
    },

    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 1,
    },

    Rcontainer: {
        marginTop: 5,
        width: '100%',
        alignItems: 'center',
    },

    Rbutton: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 1,
        width: '50%',
        borderRadius: 10,
        borderColor: 'gray',
        borderWidth: 1,
        alignItems: 'center',
    },

    selectedRole: {
        backgroundColor: '#1B3C87',
        borderColor: 'black',
    },

    Rtext: {
        color: 'gray'
    },

    buttonContainer: {
        width: '100%%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    button: {
        backgroundColor: '#1B3C87',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },

    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },

    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#1B3C87',
        borderWidth: 2,
    },

    buttonOutlineText: {
        color: '#1B3C87',
        fontSize: 16,
        fontWeight: '700',
    },

    image: {
        marginTop: 10,
        width: 230,
        height: 230,
        resizeMode: 'contain',
    }
})