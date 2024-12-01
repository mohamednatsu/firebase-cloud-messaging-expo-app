import { View, Text, StyleSheet, Pressable, Platform, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Notifications from 'expo-notifications';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import * as Device from 'expo-device';
import { arrayRemove, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../db/config';



export default function RoomsChatScreen({navigation}) {

    const [myChannels, setMyChannels] = useState([]);
    const [channels, setChannels] = useState([]);

    const [loading, setLoading] = useState(true);

    const [userToken, setExpoPushToken] = useState("")


    const fetchUserChannels = async (token) => {
        setLoading(true);
        try {
            // Query Firestore to get channels where userTokens contains the specific token
            const channelsRef = collection(db, "channels");
            const q = query(channelsRef, where("userTokens", "array-contains", token));
            const querySnapshot = await getDocs(q);

            const userChannels = [];
            querySnapshot.forEach((doc) => {
                userChannels.push({ id: doc.id, ...doc.data() });
            });

            setMyChannels(userChannels);

            console.log(userChannels.length)
        } catch (error) {
            console.error("Error fetching user channels: ", error);
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {

        registerForPushNotificationsAsync()
            .then(token => {
                setExpoPushToken(token ?? '');
                fetchUserChannels(token);
            })
            .catch(error => {
                console.error("Error registering for notifications:", error);
                setExpoPushToken(`${error}`);
            });


    }, []);



    async function registerForPushNotificationsAsync() {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

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


    const navigateToChat = (channelId, Chn) => {
        navigation.navigate('ChatScreen', { channelId, senderId: userToken, channelNameUser: Chn });
    };

    const unSubscripeUser = async (channelId, tokenToRemove) => {
        try {
            // Reference to the document that contains the tokens array
            const channelDocRef = doc(db, 'channels', channelId);
    
            // Update the document to remove the specific token
            await updateDoc(channelDocRef, {
                userTokens: arrayRemove(tokenToRemove),
            });

            fetchUserChannels(tokenToRemove)
    
            console.log(`Token ${tokenToRemove} successfully removed from channel ${channelId}`);
        } catch (error) {
            console.error('Error removing token from Firestore:', error);
        }
    }

    return (
        <View style={styels.container}>
            <Text style={styels.header}>
                My Channels
            </Text>

            <View style={styels.channelContainer}>

                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <FlatList
                        data={myChannels}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View key={item.id}>
                                <Pressable style={styels.channelStyle} onPress={() => navigateToChat(item.id, item.channelName)}>
                                    <Text style={styels.channelText}>{item.channelName}</Text>
                                </Pressable>

                                <Pressable onPress={() => unSubscripeUser(item.id, userToken)} style={{ margin: 20, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ backgroundColor: "black", color: 'white', padding: 10, borderRadius: 10 }}>Unsubscripe</Text>
                                    <FontAwesome name="minus" size={24} color="black" />
                                </Pressable>
                            </View>
                        )}
                        ListEmptyComponent={<Text>No channels found for this token.</Text>}
                    />
                )}
            </View>


        </View>
    )
}

const styels = StyleSheet.create({
    container: {
        // flex: 1,
        marginVertical: 100,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,

        width: '100%',

    },

    header: {

        fontSize: 30

    },


    channelContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        // flex: 1,
        gap: 50,
        width: '100%',
        marginHorizontal: 10,
        padding: 20
    },

    channelStyle: {
        width: "100%",
        padding: 30,
        backgroundColor: "#87CEEB",
        color: "white",
        borderRadius: 20,
        elevation: 4,
        justifyContent: "space-around",
        alignItems: "center",
        // marginHorizontal: 14,
    },

    channelText: {
        textAlign: "center",
        justifyContent: "center",
        fontWeight: 'bold',
        fontSize: 20
    }
})