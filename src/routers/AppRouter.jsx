import { Outlet } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { setNotificationAsync } from '../redux/notification/notification.action';

import Navigation from '../components/Navigation/Navigation.component';
import Toastr from '../components/Toastr/Toastr.component';

import { ThemeProvider } from '@mui/material';
import responsiveDefaultTheme from '../utils/themes/themes.utils';

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
		dispatch(setNotificationAsync(defaultNotification));
	};

	return (
		<ThemeProvider theme={responsiveDefaultTheme}>
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
