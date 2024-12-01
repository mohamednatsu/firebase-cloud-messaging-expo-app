// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './pages/HomeScreen';
import ChannelsScreen from './pages/ChannelsScreen';
import NotificationsScreen from './pages/NotificationsScreen';
import RoomsChatScreen from './pages/RoomsChatScreen';
import ChatScreen from './pages/ChatScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Channels"
          component={ChannelsScreen}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          
        />
        <Stack.Screen
          name="RoomsChat"
          component={RoomsChatScreen}
          options={
            {title: "Rooms Chat"}
          }
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
