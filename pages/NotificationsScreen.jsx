
import { useState, useEffect, useRef } from 'react';
import { Text, View, FlatList, Platform, Button } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import InputField from '../components/InputField';
import { getTokenDevice } from '../pushNotificationUtils';
import axios from 'axios';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (!Device.isDevice || Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }
        const projectId = "ad151ad6-e7ea-4448-ac72-611523a84c9c";
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(pushTokenString);
            return pushTokenString;
        } catch (e) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}

export default function NotificationsScreen({ navigation }) {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notifications, setNotifications] = useState([]); // Array to store all notifications
    const notificationListener = useRef();
    const responseListener = useRef();


    const saveNotificationInDB = (notification) => {
        axios.post("https://react-expo-fcm-default-rtdb.firebaseio.com/notifications.json", notification )
        .then((res)  => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        })
    }
    

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => {
                setExpoPushToken(token ?? '')
                getTokenDevice(token)
            })
            .catch((error) => setExpoPushToken(`${error}`));

        // Listener for foreground notifications
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotifications(prevNotifications => [
                ...prevNotifications,
                {
                    id: notification.request.identifier, // Unique ID for each notification
                    title: notification.request.content.title || 'No Title',
                    body: notification.request.content.body || 'No Body',
                    data: notification.request.content.data || {},
                },
            ]);

            saveNotificationInDB(
                {
                    id: notification.request.identifier, // Unique ID for each notification
                    title: notification.request.content.title || 'No Title',
                    body: notification.request.content.body || 'No Body',
                    data: notification.request.content.data || {},
                }
            )
        });

        // Listener for notification responses
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, [notifications]);

    return (
        <>

            <View style={{ flex: 1, padding: 16, marginTop: 50 }}>
                {/* <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>
        Your Expo push token: {expoPushToken}
      </Text> */}


                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
                    Notifications
                </Text>

                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                padding: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: '#ccc',
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
                            <Text>{item.body}</Text>
                            <Text style={{ fontSize: 12, color: 'gray' }}>Data: {JSON.stringify(item.data.data)}</Text>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>No notifications received yet</Text>
                    }
                />
            </View>
        </>
    );
}
