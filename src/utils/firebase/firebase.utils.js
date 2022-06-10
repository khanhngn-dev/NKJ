// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAxkrxSWNsqBHMXPgz_R48vckSyfNpPxBw',
	authDomain: 'nkj-react.firebaseapp.com',
	projectId: 'nkj-react',
	storageBucket: 'nkj-react.appspot.com',
	messagingSenderId: '1071395700353',
	appId: '1:1071395700353:web:5ee0a887bde7cae7585780',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();
