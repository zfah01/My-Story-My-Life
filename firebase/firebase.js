// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2SW2KrkqRUzN2gz3ZMGOr6Z-796b6az4",
  authDomain: "digitalpassport-5e53f.firebaseapp.com",
  projectId: "digitalpassport-5e53f",
  storageBucket: "digitalpassport-5e53f.appspot.com",
  messagingSenderId: "709155973097",
  appId: "1:709155973097:web:40f7254c854fc15c624d78"
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();
const st = firebase.storage();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();
const stamp = firebase.firestore.Timestamp;
const stateChanged = firebase.storage.TaskEvent.STATE_CHANGED;
const firestore = firebase.firestore();


export { auth, db, st, timestamp, stateChanged, firestore, stamp };