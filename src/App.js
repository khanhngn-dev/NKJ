import { Suspense } from 'react';
import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage/HomePage';
import AppRouter from './routers/AppRouter';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import SignInPage from './pages/SignInPage/SignInPage';
import Spinner from './components/Spinner/Spinner.component';

function App() {
	return (
		<Suspense fallback={<Spinner />}>
			<Routes>
				<Route path='/' element={<AppRouter />}>
					<Route index element={<HomePage />}></Route>
					<Route path='signup' element={<SignUpPage />}></Route>
					<Route path='signin' element={<SignInPage />}></Route>
					<Route path='*'></Route>
				</Route>
			</Routes>
		</Suspense>
	);
}

export default App;
