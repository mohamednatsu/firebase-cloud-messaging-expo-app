import React, { useState, useEffect, useRef } from 'react';
import { Text, View, FlatList, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../db/config'; // Firebase configuration
import { collection, addDoc, getDoc, doc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';

function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function sendMessage(channelId, message, senderId, channelName) {
    try {
        const messagesRef = collection(db, 'messages');
        await addDoc(messagesRef, {
            message: message,
            senderId: senderId,
            channelId: channelId,
            timestamp: serverTimestamp(),
        });
        console.log('Message sent successfully!');
    } catch (error) {
        console.error("Error sending message: ", error);
    }
}


async function getUserTokensForChannel(channelId) {
    try {
        const channelRef = doc(db, 'channels', channelId);
        const channelDoc = await getDoc(channelRef);

        if (channelDoc.exists()) {
            const userTokens = channelDoc.data().userTokens;
            return userTokens;
        } else {
            console.log("No such channel!");
            return [];
        }
    } catch (error) {
        console.error("Error getting user tokens: ", error);
        return [];
    }
}

async function sendPushNotifications(tokens, message, title) {
    const pushMessages = tokens.map(token => ({
        to: token,
        sound: 'default',
        title: title,
        body: message,
        data: { message: message }
    }));

    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pushMessages),
        });

        const responseData = await response.json();
        console.log('Notification sent successfully:', responseData);
    } catch (error) {
        console.error("Error sending notifications: ", error);
    }
}

async function sendMessageAndNotify(channelId, message, senderId, channelName) {
    // Step 1: Send message to Firestore
    await sendMessage(channelId, message, senderId);

    // Step 2: Get user tokens for the channel
    const userTokens = await getUserTokensForChannel(channelId);

    // Step 3: Send notifications to all tokens
    if (userTokens.length > 0) {
        console.log(channelName)
        await sendPushNotifications(userTokens, message, 'New Message in Channel '+ channelName);
    } else {
        console.log("No users subscribed to this channel.");
    }
}

export default function ChatScreen({ route, navigation }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messageListener = useRef();
    
    const { channelId, senderId, channelNameUser  } = route.params; // Channel ID passed from the ChannelsListScreen
    navigation.setOptions({title: channelNameUser})

    useEffect(() => {
        const messagesRef = collection(db, 'messages');
        const q = query(messagesRef, where('channelId', '==', channelId)); // Filter by channelId

        // Real-time listener
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            }));
            setMessages(newMessages);
        }, (error) => {
            console.error('Error fetching messages:', error);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [channelId]);

    const handleSendMessage = async () => {
        if (message.trim()) {
            await sendMessageAndNotify(channelId, message, senderId, channelNameUser);
            setMessage('');
        }
    };

    

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                inverted
                contentContainerStyle={styles.messageList}
                renderItem={({ item }) => {
                    const isSender = item.senderId === senderId;
                    return (
                        <View
                            style={[
                                styles.messageContainer,
                                isSender ? styles.sentMessage : styles.receivedMessage,
                            ]}
                        >
                            
                            <Text style={styles.messageText}>{item.message}</Text>
                            <Text style={styles.timestamp}>
                                {new Date(item.timestamp?.seconds * 1000).toLocaleTimeString()}
                            </Text>
                        </View>
                    );
                }}
                ListEmptyComponent={
                    <Text style={styles.emptyMessageText}>No messages yet</Text>
                }
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message"
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    messageList: {
        padding: 10,
    },
    messageContainer: {
        maxWidth: '75%',
        padding: 10,
        borderRadius: 15,
        marginVertical: 5,
    },
    sentMessage: {
        backgroundColor: '#87CEEB',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 0,
    },
    receivedMessage: {
        backgroundColor: '#FFF',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 0,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    timestamp: {
        fontSize: 10,
        color: '#999',
        marginTop: 5,
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        backgroundColor: '#FFF',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
        backgroundColor: '#F5F5F5',
    },
    sendButton: {
        backgroundColor: '#87CEEB',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    sendButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    emptyMessageText: {
        textAlign: 'center',
        marginTop: 20,
        color: 'gray',
    },
});