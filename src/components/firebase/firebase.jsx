// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBX8ui16QimJG2BcFx-OUWdNjq3NdFYiv4",
  authDomain: "dalada-77138.firebaseapp.com",
  projectId: "dalada-77138",
  storageBucket: "dalada-77138.appspot.com",
  messagingSenderId: "642223685764",
  appId: "1:642223685764:web:5f115b8150bd87e30ec2d1",
  measurementId: "G-WNL1N7LEWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);