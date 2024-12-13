import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Pressable, Alert } from "react-native";
import { logout, signIn, signUp } from "../auth/authenticate";

const SignUpScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const userSignUp = async (email, password) =>
    {

        if (email === "" || password === "") {
            Alert.alert("Error", "Please fill in all fields");
        }
        else {
            const isUser = await signUp(email, password)

            if (isUser) {
                Alert.alert("Account Created Successfully!");
                navigation.navigate("Home");
                console.log(response);
            }
            else {
                Alert.alert("Error while creating");
            }

        }
    }

    return (
        <View style={styles.container}>

            <View style={{justifyContent: "center", alignItems: "center", marginTop: 20, marginBottom: 40}}>
                <Text style={{textAlign: "center", fontSize: 30, fontWeight: "bold"}}>
                    Sign Up
                </Text>
            </View>

            <View style={{width: '90%'}}>
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
                <Pressable  style={styles.button} onPress={() => userSignUp(email, password)}>
                    <Text style={{textAlign: 'center'}}>
                        Sign Up
                    </Text>
                </Pressable>
            </View>
            {/* <Button title="Sign In" onPress={() => signIn(email, password)} /> */}
            {/* <Button title="Sign Out" onPress={logout} /> */}
        </View>
    );
};

export default SignUpScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
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
        borderRadius: 40, // Rounded button,
        textAlign: 'center',
        elevation: 3,
        width: "70%"
    },

})