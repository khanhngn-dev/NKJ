import { Suspense, lazy, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './utils/firebase/firebase.utils';
import { updateCurrentUser } from './redux/user/user.slice';
import Spinner from './components/Spinner/Spinner.component';
import ROUTE from './routers/Routes';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const AppRouter = lazy(() => import('./routers/AppRouter'));
const SignUpPage = lazy(() => import('./pages/SignUpPage/SignUpPage'));
const SignInPage = lazy(() => import('./pages/SignInPage/SignInPage'));
const Error404Page = lazy(() => import('./pages/Error404Page/Error404Page'));
const AlphabetPage = lazy(() => import('./pages/AlphabetPage/AlphabetPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'));
const CreatePage = lazy(() => import('./pages/CreatePage/CreatePage'));
const SetPage = lazy(() => import('./pages/SetPage/SetPage'));
const FlashCardPage = lazy(() => import('./pages/FlashCardPage/FlashCardPage'));
const BecomeUserPage = lazy(() => import('./pages/BecomeUserPage/BecomeUserPage'));

function App() {
	const currentUser = useSelector((state) => state.user.currentUser);
	const dispatch = useDispatch();
	useEffect(() => {
		const unSubscribe = onAuthStateChanged(auth, (user) => {
			dispatch(updateCurrentUser(user));
		});
		return () => {
			unSubscribe();
		};
		// eslint-disable-next-line
	}, []);

	return (
		<Suspense fallback={<Spinner />}>
			<Routes>
				<Route path='/' element={<AppRouter />}>
					<Route index element={<HomePage />}></Route>
					<Route
						path={ROUTE.SIGNUP}
						// element={<SignUpPage />}
						element={currentUser ? <Navigate to='/' replace /> : <SignUpPage />}
					></Route>
					<Route
						path={ROUTE.SIGNIN}
						// element={ <SignInPage />}
						element={currentUser ? <Navigate to='/' replace /> : <SignInPage />}
					></Route>
					<Route path={ROUTE.ALPHABET} element={<AlphabetPage />}></Route>
					<Route
						path={ROUTE.CREATE}
						element={currentUser ? <CreatePage /> : <BecomeUserPage />}
					></Route>
					<Route
						path={ROUTE.CREATE_ID}
						element={currentUser ? <CreatePage /> : <BecomeUserPage />}
					></Route>
					<Route path={ROUTE.PROFILE} element={<ProfilePage />}></Route>
					<Route path={ROUTE.PROFILE_ID} element={<ProfilePage />}></Route>
					<Route path={ROUTE.SET} element={<SetPage />}></Route>
					<Route path={ROUTE.SET_PRIVACY_ID} element={<FlashCardPage />}></Route>
					<Route path='*' element={<Error404Page />}></Route>
				</Route>
			</Routes>
		</Suspense>
	);
}

export default App;
