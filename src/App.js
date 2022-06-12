import { Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './utils/firebase/firebase.utils';
import { updateCurrentUser } from './redux/user/user.slice';

import HomePage from './pages/HomePage/HomePage';
import AppRouter from './routers/AppRouter';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import SignInPage from './pages/SignInPage/SignInPage';
import Spinner from './components/Spinner/Spinner.component';
import Error404Page from './pages/Error404Page/Error404Page';

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
					<Route path='*' element={<Error404Page />}></Route>
				</Route>
			</Routes>
		</Suspense>
	);
}

export default App;
