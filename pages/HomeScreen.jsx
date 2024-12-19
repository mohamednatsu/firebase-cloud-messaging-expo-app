import { useState, useEffect, useRef } from 'react';
import { Text, View, FlatList, Platform, Button, StyleSheet, Pressable } from 'react-native';
import * as Notifications from 'expo-notifications';
import { userEvent } from '../db/config';


export default function HomeScreen({ navigation }) {

    async function sendWelcomeNotification() {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Welcome to Our App!",
                body: "Thanks for joining us!",
            },
            trigger: null, // Send immediately
        });
    }

    useEffect(() => {
        sendWelcomeNotification();
    }, [])

    return (

        <View style={styles.container}>

            <Text style={{ height: 100, fontSize: 30 }}>
                Expo Task App
            </Text>

            <View style={styles.btn}>


                <Pressable style={styles.button} onPress={() => navigation.navigate('Channels')}>

                    <Text style={{ textAlign: "center", color: "black" }}>
                        Go to Channels
                    </Text>
                </Pressable>
            </View>


            <View style={styles.btn}>

                <Pressable style={styles.button} onPress={() => navigation.navigate('Notifications')}>

                    <Text style={{ textAlign: "center", color: "black" }}>
                        Go to Notifications
                    </Text>
                </Pressable>
            </View>

            <View style={styles.btn}>

                <Pressable style={styles.button} onPress={() => navigation.navigate('RoomsChat')}>

                    <Text style={{ textAlign: "center", color: "black" }}>
                        Rooms Chat
                    </Text>
                </Pressable>
            </View>

        </View>
    );
}


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
