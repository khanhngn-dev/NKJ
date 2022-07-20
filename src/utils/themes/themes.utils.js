import { createTheme, responsiveFontSizes } from '@mui/material/styles';
// import { viVN, jaJP, enUS } from '@mui/material/locale';

const defaultTheme = createTheme(
	{
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
	}
	// viVN
	// jaJP
	// // enUS,
);

const responsiveDefaultTheme = responsiveFontSizes(defaultTheme);

export default responsiveDefaultTheme;
