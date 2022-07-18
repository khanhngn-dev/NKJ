import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const defaultTheme = createTheme({
	typography: {
		fontFamily: 'Nunito,Roboto,sans-serif',
	},
	palette: {
		primary: {
			main: '#C00734',
		},
		secondary: {
			main: '#FFB8B1',
		},
		cta: {
			main: '#FA0000',
		},
	},
});

const responsiveDefaultTheme = responsiveFontSizes(defaultTheme);

export default responsiveDefaultTheme;
