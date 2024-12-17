import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Pressable, Alert } from "react-native";
import { logout, signIn, signUp } from "../auth/authenticate";
import { logFirebaseEvent, login } from "../db/config";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const userLogin = async (email, password) => {

        if (email === "" || password === "") {
            Alert.alert("Error", "Please fill in all fields");
        }
        else {
            
            const isUser = await signIn(email, password)

            if (isUser) {
                Alert.alert("Login Succefully!");
                login();
                console.log("First-time login event logged");
                navigation.navigate("Home");
                console.log(response);
            }
            else {
                Alert.alert("Error while login please check your data");
            }

        }
    }

    return (
        <View style={styles.container}>

            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20, marginBottom: 40 }}>
                <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "bold" }}>
                    Login
                </Text>
            </View>

            <View style={{ width: '90%' }}>
                <Text>Email:</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}

                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                />
                <Text>Password:</Text>
                <TextInput
                    value={password}
                    onChangeText={setPassword}

                    secureTextEntry
                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                />
            </View>


            <View style={styles.btn}>
                <Pressable style={styles.button} onPress={() => userLogin(email, password)}>
                    <Text style={{ textAlign: 'center' }}>
                        Log In
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default LoginScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        marginTop: 200,
        paddingHorizontal: 10,
        alignItems: 'center',
    },

    btn: {
        width: "70%",
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },

    button: {
        backgroundColor: '#87CEEB',
        padding: 15,
        borderRadius: 50, // Rounded button,
        textAlign: 'center',
        elevation: 3,
        width: "70%"
    },

})