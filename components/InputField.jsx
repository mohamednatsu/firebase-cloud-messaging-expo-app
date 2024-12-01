import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native'

import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../db/config';


const InputField = ({showData}) => {

    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (text) => {
        setInputValue(text);
    };

    const handleButtonPress = async () => {
        try {

            if (inputValue == "") {
                Alert.alert("Sorry", "Please enter channel")
            }

            else {
                const docRef = await addDoc(collection(db, "channels"), {
                    channelName: inputValue,
                    channelDescription: "This is Just channel for notification",
                });
                
                console.log("Document written with ID: ", docRef.id);
                
                Alert.alert("Success!", "Channel successfully added")
                setInputValue("")

                showData()
            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <View style={styles.container}>

            <View style={{width: 300}}>

            <TextInput
                style={styles.input}
                placeholder="Enter here"
                value={inputValue}
                onChangeText={handleInputChange}
                />
                </View>
            <Button
                title="Add Channel"
                onPress={handleButtonPress}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '100%',
        marginBottom: 16,
        paddingLeft: 8,
    },
});


export default InputField