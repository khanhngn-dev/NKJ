import { Outlet } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentNotification } from '../redux/notification/notification.slice';

import Navigation from '../components/Navigation/Navigation.component';
import Toastr from '../components/Toastr/Toastr.component';

import { ThemeProvider } from '@mui/material';
import { defaultTheme } from '../utils/themes/themes.utils';

const defaultNotification = {
	message: '',
	severity: '',
};

const AppRouter = () => {
	const dispatch = useDispatch();
	const message = useSelector((state) => state.notification.message);
	const severity = useSelector((state) => state.notification.severity);

	const removeNotification = (event, reason) => {
		if (reason === 'clickaway') return;
		dispatch(setCurrentNotification(defaultNotification));
	};

	return (
		<ThemeProvider theme={defaultTheme}>
			<Navigation />
			<Outlet />
			{message && (
				<Toastr severity={severity} timeToLive={5} removeHandler={removeNotification}>
					{message}
				</Toastr>
			)}
		</ThemeProvider>
	);
};

export default AppRouter;
