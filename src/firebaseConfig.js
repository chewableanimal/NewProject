// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOZ7W_Buv72ZOh8nM_F16NlYH02px-qeg",
  authDomain: "whattocook-9f276.firebaseapp.com",
  projectId: "whattocook-9f276",
  storageBucket: "whattocook-9f276.appspot.com",
  messagingSenderId: "55773949200",
  appId: "1:55773949200:web:c8b1225cf2cee34677c995",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
