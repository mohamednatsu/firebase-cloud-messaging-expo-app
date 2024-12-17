import React from "react";
import { Button, View, Text } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../db/config";

export default function GoogleScreen() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "320650251556-7ikdcho5ccf6q5p6vho6gd9khevsqlkb.apps.googleusercontent.com",
        redirectUri: "https://auth.expo.io/@mohamedsalih/react-expo-push-notifications",
    });

    React.useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then((user) => {
                    console.log("User signed in:", user);
                })
                .catch((error) => console.error("Authentication error:", error));
        }
    }, [response]);

    return (
        <View style={{flex: 1, marginTop: 30}}>
            <Button
                disabled={!request}
                title="Sign in with Google"
                onPress={() => promptAsync()}
            />
        </View>
    );
}
