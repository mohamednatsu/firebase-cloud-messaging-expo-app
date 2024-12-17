// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './pages/HomeScreen';
import ChannelsScreen from './pages/ChannelsScreen';
import NotificationsScreen from './pages/NotificationsScreen';
import RoomsChatScreen from './pages/RoomsChatScreen';
import ChatScreen from './pages/ChatScreen';
import SignUpScreen from './pages/SignUpScreen';
import AuthenticateScreen from './pages/AuthenticateScreen';
import LoginScreen from './pages/LoginScreen';
import GoogleScreen from './pages/GoogleScreen';
import PhoneScreen from './pages/PhoneScreen';

const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Auth"
          options={{
            headerShown: false
          }}
          component={AuthenticateScreen}
        />
        <Stack.Screen
          name="SignUp"
          options={{
            headerShown: false
          }}
          component={SignUpScreen}
        />
        <Stack.Screen
          name="Google"
          options={{
            headerShown: false
          }}
          component={GoogleScreen}
        />
        <Stack.Screen
          name="Phone"
          options={{
            headerShown: false
          }}
          component={PhoneScreen}
        />
        <Stack.Screen
          name="Login"
          options={{
            headerShown: false
          }}
          component={LoginScreen}
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
