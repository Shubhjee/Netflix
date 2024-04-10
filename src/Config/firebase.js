import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDJ5h4Sydpr6m-_rC9SnltgiVCKaD_IkbY",
  authDomain: "cs-soft-netflix.firebaseapp.com",
  projectId: "cs-soft-netflix",
  storageBucket: "cs-soft-netflix.appspot.com",
  messagingSenderId: "513245019552",
  appId: "1:513245019552:web:6f68b0d88decdba8d6f8c5",
  measurementId: "G-6V2Z7HSPJS",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
