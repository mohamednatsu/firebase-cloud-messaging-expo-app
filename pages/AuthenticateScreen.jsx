import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Pressable } from "react-native";
import { logout, signIn, signUp } from "../auth/authenticate";

const AuthenticateScreen = ({navigation}) => {

    return (

        <View style={styles.container}>

            <Text style={{ height: 100, fontSize: 30 }}>
                Expo Task App
            </Text>

            <View style={styles.btn}>


                <Pressable style={styles.button} onPress={() => navigation.navigate('SignUp')}>

                    <Text style={{ textAlign: "center", color: "black" }}>
                        Sign Up
                    </Text>
                </Pressable>
            </View>


            <View style={styles.btn}>

                <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>

                    <Text style={{ textAlign: "center", color: "black" }}>
                        Login
                    </Text>
                </Pressable>
            </View>

        </View>
    );
};

export default AuthenticateScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
        width: '100%',
    },

    btn: {
        width: "70%",
        height: 50,
        borderRadius: 10,
    },

    button: {
        backgroundColor: '#87CEEB',
        padding: 15,
        borderRadius: 50, // Rounded button,
        textAlign: 'center',
        elevation: 3
    },
})