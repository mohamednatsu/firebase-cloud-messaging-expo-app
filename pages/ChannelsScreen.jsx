import { View, Text, StyleSheet, Alert, FlatList, ScrollView, Button, Pressable, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import InputField from '../components/InputField'
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Notifications from 'expo-notifications';
import { userEvent } from "../db/config";

import * as Device from 'expo-device';


import { db } from '../db/config';
import { useStore } from 'zustand';

export const getTokenDevice = (token) => {
    console.log(token);
}

export default function ChannelsScreen() {


    const user = "ExponentPushToken[cI28_DNvpEIkqfKUW1sn12]"

    const [channels, setChannels] = useState([])
    const [tokenUsers, setTokenUsers] = useState([])
    const [expoPushToken, setExpoPushToken] = useState("")
    const [loading, setLoading] = useState(true)

    const [isSubscribed, setIsSubscribed] = useState(false);



    // here we can get all the data channels and subscribe
    let getData = async () => {
        let data = [];

        setLoading(true)
        const querySnapshot = await getDocs(collection(db, "channels"));
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            data.push({ data: doc.data(), id: doc.id });
        });


        setChannels(data)

        setLoading(false)
    }


    // Function to check if the user is in the channel
    const isUserInChannel = async (userToken, channelId) => {
        try {
            const channelRef = doc(db, "channels", channelId);
            const channelDoc = await getDoc(channelRef);

            if (channelDoc.exists()) {
                const { userTokens } = channelDoc.data();
                return userTokens && userTokens.includes(userToken);
            }
            return false;
        } catch (error) {
            console.error("Error checking subscription status:", error);
            return false;
        }
    };

    useEffect(() => {

        getData()
        getTokenDevice()


        registerForPushNotificationsAsync()
        .then(token => {
            setExpoPushToken(token ?? '');
            console.log(token); // Passes the token to the function
        })
        .catch(error => {
            console.error("Error registering for notifications:", error);
            setExpoPushToken(`${error}`);
        });

    }, [])


    const addUserTokenToChannel = async (channelId, userToken) => {
        try {
            const channelRef = doc(db, "channels", channelId);
            await updateDoc(channelRef, {
                userTokens: arrayUnion(userToken), // Add token to the array
            });
            setIsSubscribed(true);
            console.log("User token added successfully!");
        } catch (error) {
            console.error("Error adding user token: ", error);
        }
    };


    const removeUserTokenToChannel = async (channelId, userToken) => {
        try {
            const channelRef = doc(db, "channels", channelId);
            await updateDoc(channelRef, {
                userTokens: arrayRemove(userToken), // Add token to the array
            });
            console.log("User token added successfully!");
        } catch (error) {
            console.error("Error adding user token: ", error);
        }
    };


    const removeChannel = (id) => {
        Alert.alert("Removed channel")
        deleteDoc(doc(db, 'channels', id))
        getData()
    }

    const subscripeChannel = (channelId, userToken, channelName) => {
        Alert.alert("Subscripe channel")
        addUserTokenToChannel(channelId, userToken)
        userEvent('user_subscription', {
            user_id: userToken,
            channel_id: channelId,
            subscription_status: 'subscribed',
        });
        
        console.log("Subscription event logged");
    }


    const unSubscripeChannel = (channelId, userToken) => {
        Alert.alert("Subscripe channel")
        addUserTokenToChannel(channelId, userToken)
    }


    const verifyUser = async (usertoken, channelId) => {
        setLoading(true);
        const isUserSubscribed = await isUserInChannel(usertoken, channelId);

        console.log(isUserSubscribed)

        setIsSubscribed(isUserSubscribed)

        return isUserSubscribed == undefined ? false : true
    }

    // Function to unsubscribe the user
    const unsubscribeFromChannel = async (channelId, userToken) => {
        try {
            const channelRef = doc(db, "channels", channelId);
            await updateDoc(channelRef, {
                userTokens: arrayRemove(userToken), // Remove the user token from the array
            });
            setIsSubscribed(false); // Update state
        } catch (error) {
            console.error("Error unsubscribing from channel:", error);
        }
    };


    async function registerForPushNotificationsAsync() {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    
        // if (!Device.isDevice) {
        //     alert('Must use physical device for Push Notifications');
        //     return null;
        // }
    
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
    
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
    
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return null;
        }
    
        try {
            const projectId = "ad151ad6-e7ea-4448-ac72-611523a84c9c"; // Replace with your actual project ID
            const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            console.log("Device Token:", token);
            return token;
        } catch (error) {
            console.error("Error getting push token:", error);
            return null;
        }
    }
    

    const getUserTokensFromChannel = async (channelId, userToken) => {
        try {
            const channelRef = doc(db, "channels", channelId);
            const channelDoc = await getDoc(channelRef);

            if (channelDoc.exists()) {
                const data = channelDoc.data();
                console.log("User tokens:", data.userTokens);
                setTokenUsers(data.userTokens)
                return data.userTokens.includes(userToken);
            } else {
                console.log("Channel does not exist!");
                return [];
            }
        } catch (error) {
            console.error("Error fetching user tokens: ", error);
            return [];
        }
    };

    return (

        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: "left" }}>Add New Channel</Text>
                <InputField showData={getData} />
            </View>
            <View style={styles.inputContainer}>
                <Text style={{ fontSize: 23, fontWeight: 'bold', marginBottom: 16, textAlign: "left", width: 300 }}>
                    All Channels
                </Text>

                <View style={{ flex: 1, height: 1024, width: '100%' }}>

                    <FlatList
                        data={channels}
                        keyExtractor={(item) => item.data.channelName}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    padding: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#ccc',
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: "center",
                                    width: "100%",
                                    alignItems: "center",
                                    gap: 20
                                }}
                                key={item.data.channelName}
                            >
                                <Pressable style={styles.button} onPress={() => alert('Button Pressed!')}>
                                    <Text style={{ textAlign: "center" }}>
                                        {item.data.channelName}
                                    </Text>
                                </Pressable>

                                <View style={{ flexDirection: 'row', gap: 30 }}>
                                    <Pressable
                                        onPress={() => removeChannel(item.id)}
                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text style={{ fontSize: 12 }}>Remove</Text>
                                        <FontAwesome name="remove" size={24} color="red" />
                                    </Pressable>

                                    {/* Subscription Button Logic */}
                                    {tokenUsers.includes(expoPushToken) ? (
                                        <Pressable
                                            onPress={() => unsubscribeFromChannel(item.id, expoPushToken)}
                                            style={{
                                                flex: 1,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text style={{ fontSize: 12 }}>Unsubscribe</Text>
                                            <FontAwesome name="minus" size={24} color="black" />
                                        </Pressable>
                                    ) : (
                                        <Pressable
                                            onPress={() => subscripeChannel(item.id, expoPushToken, item.data.channelName)}
                                            style={{
                                                flex: 1,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text style={{ fontSize: 12 }}>Subscribe</Text>
                                            <FontAwesome name="plus" size={24} color="black" />
                                        </Pressable>
                                    )}
                                </View>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
                        }
                    />


                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        height: "100%",
    },

    inputContainer: {
        width: '100%',
        height: 100,
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: "left"
    },

    button: {
        backgroundColor: '#87CEEB',
        padding: 15,
        borderRadius: 50, // Rounded button,
        textAlign: 'center',
    },

})