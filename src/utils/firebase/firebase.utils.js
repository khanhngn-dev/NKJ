// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	FacebookAuthProvider,
	GithubAuthProvider,
	signInWithPopup,
	signOut,
} from 'firebase/auth';
import {
	getFirestore,
	doc,
	collection,
	getDoc,
	getDocs,
	query,
	limit,
	orderBy,
	where,
	writeBatch,
	setDoc,
	updateDoc,
} from 'firebase/firestore';
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
// eslint-disable-next-line
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
const firestore = getFirestore();
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

export const setUserInfo = async (userID, info) => {
	const userRef = doc(firestore, `user/${userID}`);
	await setDoc(userRef, info);
};

export const updateUserInfo = async (userID, updatedInfo) => {
	const userRef = doc(firestore, `user/${userID}`);
	await updateDoc(userRef, updatedInfo);
};

export const checkUserInfoExist = async ({ uid, displayName, email, phoneNumber, photoURL }) => {
	const userRef = doc(firestore, `user/${uid}`);
	const snapshot = await getDoc(userRef);
	if (!snapshot.exists())
		await setUserInfo(uid, { uid, displayName, email, phoneNumber, photoURL });
};

export const createUserUsingEmailPassword = async (email, password) => {
	if (!email || !password) return;
	const { user } = await createUserWithEmailAndPassword(auth, email, password);
	checkUserInfoExist(user);
	return user;
};

export const signInUsingEmailPassword = async (email, password) => {
	if (!email || !password) return;
	const { user } = await signInWithEmailAndPassword(auth, email, password);
	await checkUserInfoExist(user);
	return user;
};

export const signInUsingGooglePopUp = async () => {
	const { user } = await signInWithPopup(auth, googleProvider);
	await checkUserInfoExist(user);
	return user;
};

export const signInUsingFacebookPopUp = async () => {
	const { user } = await signInWithPopup(auth, facebookProvider);
	await checkUserInfoExist(user);
	return user;
};

export const signInUsingGithubPopup = async () => {
	const { user } = await signInWithPopup(auth, githubProvider);
	await checkUserInfoExist(user);
	return user;
};

export const signOutUser = async () => {
	signOut(auth);
};

export const fetchUserInfo = async (userID) => {
	if (!userID) return;
	const userRef = doc(firestore, `user/${userID}`);
	return (await getDoc(userRef)).data();
};

export const addLearningSet = async (set, userID) => {
	if (!set.id || !userID) return;
	const batch = writeBatch(firestore);
	const setRefPublic = doc(firestore, `public_sets/${set.id}`);
	if (set.privacy) {
		batch.set(setRefPublic, set);
		// await setDoc(setRefPublic, set);
	} else {
		// const doc = await getDoc(setRefPublic);
		// if (doc.exists()) deleteDoc(setRefPublic);
		batch.delete(setRefPublic);
	}
	const setRef = doc(firestore, `user/${userID}/sets/${set.id}`);
	// await setDoc(setRef, set);
	batch.set(setRef, set);
	batch.commit();
};

export const updateLearningSet = async (setID, userID, updatedContent) => {
	if (!setID || !userID || !updatedContent) return;
	const batch = writeBatch(firestore);
	const setRef = doc(firestore, `user/${userID}/sets/${setID}`);
	const setRefPublic = doc(firestore, `public_sets/${setID}`);
	if (updatedContent.privacy) {
		const docSnapshot = await getDoc(setRefPublic);
		if (docSnapshot.exists()) {
			// await updateDoc(setRefPublic, updatedContent);
			batch.update(setRefPublic, updatedContent);
		} else {
			batch.set(setRefPublic, updatedContent);
		}
	} else {
		const doc = await getDoc(setRefPublic);
		if (doc.exists()) {
			// deleteDoc(setRefPublic);
			batch.delete(setRefPublic);
		}
	}
	// await updateDoc(setRef, updatedContent);
	batch.update(setRef, updatedContent);
	batch.commit();
};

export const fetchLearningSet = async (setID, userID) => {
	if (!setID || !userID) return;
	const setRef = doc(firestore, `user/${userID}/sets/${setID}`);
	const setSnapshot = await getDoc(setRef);
	if (setSnapshot.exists()) return setSnapshot.data();
	// throw new Error('Set does not exist');
};

export const fetchPublicLearningSet = async (setID) => {
	if (!setID) return;
	const setRef = doc(firestore, `public_sets/${setID}`);
	const setSnapshot = await getDoc(setRef);
	if (setSnapshot.exists()) return setSnapshot.data();
	// throw new Error('Set does not exist');
};

export const DEFAULT_MAX_SET = 6;

export const fetchAllLearningSets = async (userID, numSets = DEFAULT_MAX_SET) => {
	if (!userID) return;
	const setsRef = collection(firestore, `user/${userID}/sets`);
	const q = query(setsRef, orderBy('created', 'desc'), limit(numSets));
	const setsSnapshot = await getDocs(q);
	if (!setsSnapshot.empty) return setsSnapshot.docs.map((doc) => doc.data());
};

export const fetchAllPublicLearningSets = async (numSets = DEFAULT_MAX_SET) => {
	const publicSetsRef = collection(firestore, 'public_sets');
	const q = query(publicSetsRef, orderBy('created', 'desc'), limit(numSets));
	const setsSnapshot = await getDocs(q);
	if (!setsSnapshot.empty) return setsSnapshot.docs.map((doc) => doc.data());
};

export const deleteLearningSet = async (setID, userID) => {
	if (!setID || !userID) return;
	const batch = writeBatch(firestore);
	const setRef = doc(firestore, `user/${userID}/sets/${setID}`);
	const setRefPublic = doc(firestore, `public_sets/${setID}`);
	// await deleteDoc(setRefPublic);
	// await deleteDoc(setRef);
	batch.delete(setRefPublic);
	batch.delete(setRef);
	batch.commit();
};

export const fetchMostPopularSets = async (userID) => {
	if (!userID) return;
	const setsRef = collection(firestore, `user/${userID}/sets`);
	const q = query(setsRef, where('privacy', '==', true));
	const sq = query(q, orderBy('ratings.avgStars', 'desc'), limit(6));
	const setsSnapshot = await getDocs(sq);
	if (!setsSnapshot.empty) return setsSnapshot.docs.map((doc) => doc.data());
};
