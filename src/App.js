import { Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './utils/firebase/firebase.utils';
import { updateCurrentUser } from './redux/user/user.slice';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const AppRouter = lazy(() => import('./routers/AppRouter'));
const SignUpPage = lazy(() => import('./pages/SignUpPage/SignUpPage'));
const SignInPage = lazy(() => import('./pages/SignInPage/SignInPage'));
const Spinner = lazy(() => import('./components/Spinner/Spinner.component'));
const Error404Page = lazy(() => import('./pages/Error404Page/Error404Page'));
const AlphabetPage = lazy(() => import('./pages/AlphabetPage/AlphabetPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'));
const CreatePage = lazy(() => import('./pages/CreatePage/CreatePage'));

function App() {
	const currentUser = useSelector((state) => state.user.currentUser);
	const dispatch = useDispatch();
	// eslint-disable-next-line
	const unsub = onAuthStateChanged(auth, (user) => {
		dispatch(updateCurrentUser(user));
	});

	return (
		<Suspense fallback={<Spinner />}>
			<Routes>
				<Route path='/' element={<AppRouter />}>
					<Route index element={<HomePage />}></Route>
					<Route
						path='signup'
						element={currentUser ? <Navigate to='/' replace /> : <SignUpPage />}
					></Route>
					<Route
						path='signin'
						element={currentUser ? <Navigate to='/' replace /> : <SignInPage />}
					></Route>
					<Route path='alphabet' element={<AlphabetPage />}></Route>
					<Route path='user/:id' element={<ProfilePage />}></Route>
					<Route path='create' element={<CreatePage />}></Route>
					<Route path='*' element={<Error404Page />}></Route>
				</Route>
			</Routes>
		</Suspense>
	);
}

export default App;
