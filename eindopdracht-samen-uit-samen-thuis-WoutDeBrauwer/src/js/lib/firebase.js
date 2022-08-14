/**
 * My Firebase Config
 */

// Import Firebase
import {
  initializeApp,
} from 'firebase/app';

// Import Firebase authentication
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  deleteUser,
} from 'firebase/auth';

// Import Firebase database
import {
  getDatabase,
  ref,
  set,
  onValue,
  child,
  get,
} from 'firebase/database';

// Import Firebase firestore
import {
  getFirestore,
  addDoc,
  serverTimestamp,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJmPWi901fAPUEiPkz_RjNmUu1zL81oxY",
  authDomain: "samen-uit-samen-thuis-80e20.firebaseapp.com",
  projectId: "samen-uit-samen-thuis-80e20",
  storageBucket: "samen-uit-samen-thuis-80e20.appspot.com",
  messagingSenderId: "951160888410",
  appId: "1:951160888410:web:717e7f893f1a8f301ccc63",
  measurementId: "G-9DJ21MBJB8"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
// Get the authentication
const auth = getAuth();
//  Get the realtime database
const dbRealtime = getDatabase();
// Get the firestore
const dbFirestore = getFirestore(firebase);

export {
  //  Firebase
  firebase,
  addDoc,
  serverTimestamp,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  setDoc,
  dbFirestore,
  query,
  orderBy,
  onSnapshot,
  //  Authentication
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  deleteUser,
  //  Realtime database
  dbRealtime,
  ref,
  set,
  onValue,
  child,
  get,
};
