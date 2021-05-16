
import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyAj_2JmVJAu8WHzhgcbvohkYsi_U4dqLxU",
    authDomain: "trello-49e71.firebaseapp.com",
    projectId: "trello-49e71",
    storageBucket: "trello-49e71.appspot.com",
    messagingSenderId: "170228632694",
    appId: "1:170228632694:web:b2a611926916caedafe357"
};
  // Initialize Firebase
app.initializeApp(firebaseConfig);

const db = app.firestore();
const auth = app.auth();

export {db, auth};