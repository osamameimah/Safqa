 import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
 import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC92Kswi5YNWCf0UtDA50aCnvAUowbJKs0",
  authDomain: "safqa-9f402.firebaseapp.com",
  projectId: "safqa-9f402",
  storageBucket: "safqa-9f402.firebasestorage.app",
  messagingSenderId: "25541478716",
  appId: "1:25541478716:web:a0fff7d500793069c67639",
  measurementId: "G-7TLVDKPB8T"
};

 const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

 export const db = getFirestore(app);

 export default app;

export const auth = getAuth(app);