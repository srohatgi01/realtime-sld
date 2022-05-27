import firebase from "firebase/app";
import "firebase/firestore";

export default function initFirebase() {
    const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
    };

    if (!firebase.apps.length) {
        const app = firebase.initializeApp(firebaseConfig);
        console.log("Firebase Initialized")
        return app
    }

    else return;
}

export function initFirestore() {
    const firebaseObj = initFirebase()
    if (firebaseObj !== undefined || firebaseObj !== null) {
        console.log("Firestore Initialized")
        return firebase.firestore();
    }

    else return;
}