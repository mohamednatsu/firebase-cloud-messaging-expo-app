import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { getAuth, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../db/config"; // Firebase configuration

export default function PhoneScreen() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationId, setVerificationId] = useState(null);
    const [verificationCode, setVerificationCode] = useState("");
    const recaptchaVerifier = React.useRef(null);


    // Request OTP
    const requestOTP = async () => {
        try {
            const phoneProvider = getAuth();
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier.current);
            setVerificationId(confirmation.verificationId);
            Alert.alert("Success", "OTP sent to your phone number.");
        } catch (error) {
            console.error("Error sending OTP:", error.message);
            Alert.alert("Error", error.message);
        }
    };

    // Confirm OTP
    const confirmOTP = async () => {
        try {
            // Create a PhoneAuthProvider credential
            const credential = PhoneAuthProvider.credential(verificationId, verificationCode);

            // Sign in with the credential
            await signInWithCredential(auth, credential);

            Alert.alert("Success", "Phone authentication successful!");
        } catch (error) {
            console.error("Error verifying OTP:", error.message);
            Alert.alert("Error", error.message);
        }
    };


    return (
        <View style={{ padding: 20 }}>
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={auth.app.options}
            />

            <Text style={{ fontSize: 20, marginBottom: 10 }}>Phone Authentication</Text>

            <TextInput
                placeholder="Enter phone number (+1234567890)"
                style={{ borderBottomWidth: 1, marginBottom: 20 }}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
            />

            <Button title="Send OTP" onPress={requestOTP} />

            <TextInput
                placeholder="Enter verification code"
                style={{ borderBottomWidth: 1, marginVertical: 20 }}
                keyboardType="number-pad"
                value={verificationCode}
                onChangeText={(text) => setVerificationCode(text)}
            />

            <Button title="Verify OTP" onPress={confirmOTP} />
        </View>
    );
}
