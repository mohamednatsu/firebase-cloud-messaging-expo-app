import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPhoneNumber } from "firebase/auth";
import { app } from "../db/config";

// Initialize Firebase Auth
const auth = getAuth(app);

// Sign Up
export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up:", userCredential.user);
        return true
    } catch (error) {
        console.error("Sign-up error:", error);
        return false;
    }
};

// Sign In
export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in:", userCredential.user);
        return true;
    } catch (error) {
        console.error("Sign-in error:", error);
        return false;
    }
};


export const phoneSignIn = async (phoneNumber) => {
    try {
        const userCredential = await signInWithPhoneNumber(auth, phoneNumber)
        console.log("User signed in:", userCredential.user);
        return true;
    } catch (error) {
        console.error("Sign-in error:", error);
        return false;
    }
}


// export const createAccountWithPhone = async () => {
//     try {
//         const userCredential = await creat
//     } catch (error) {
        
//     }
// }

// Sign Out
export const logout = async () => {
    try {
        await signOut(auth);
        console.log("User signed out");
    } catch (error) {
        console.error("Sign-out error:", error);
    }
};
