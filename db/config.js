// Import the functions you need from the SDKs you need
import { getAuth } from "@firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";
// import analytics from "@react-native-firebase/analytics";
import * as Analytics from 'expo-firebase-analytics';


const firebaseConfig = {
    apiKey: "AIzaSyDF0RuOr_28UJcrmfBxjfT_G0g-B15bswM",
    authDomain: "react-expo-fcm.firebaseapp.com",
    databaseURL: "https://react-expo-fcm-default-rtdb.firebaseio.com",
    projectId: "react-expo-fcm",
    storageBucket: "react-expo-fcm.firebasestorage.app",
    messagingSenderId: "733382906897",
    appId: "1:733382906897:web:d18de7aa53225b38958db0",
    measurementId: "G-5WD3CTRHMS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const analytics = getAnalytics(app)
export const logFirebaseEvent = (eventName, eventParams) => {
    logEvent(analytics, eventName, eventParams);
};


export async function userEvent(eventName, eventParams) {
    await Analytics.logEvent(eventName, eventParams);
}

