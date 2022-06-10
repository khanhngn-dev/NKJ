import { ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router';
import Navigation from '../components/Navigation/Navigation.component';
import { defaultTheme } from '../utils/themes/themes.utils';

const AppRouter = () => {
	return (
		<ThemeProvider theme={defaultTheme}>
			<Navigation />
			<Outlet />
		</ThemeProvider>
	);
};

export default AppRouter;
