import React from "react";
import { Button, View, Text } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default function GoogleScreen() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
        redirectUri: "https://auth.expo.io/@your-expo-username/your-expo-project-name",
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
        <View>
            <Button
                disabled={!request}
                title="Sign in with Google"
                onPress={() => promptAsync()}
            />
        </View>
    );
}
