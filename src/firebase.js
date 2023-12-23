import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqVapXofO4azpvWtbWGOwZw0UHdMoWv6E",
  authDomain: "hhhh-c074b.firebaseapp.com",
  databaseURL: "https://hhhh-c074b-default-rtdb.firebaseio.com",
  projectId: "hhhh-c074b",
  storageBucket: "hhhh-c074b.appspot.com",
  messagingSenderId: "301290959909",
  appId: "1:301290959909:web:039afac36519637b25fbcc",
  measurementId: "G-HYG2BWLLK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);