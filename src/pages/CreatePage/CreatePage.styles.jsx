import { Switch } from '@mui/material';
import styled from '@emotion/styled';
export const MaterialUISwitch = styled(Switch)(() => ({
	width: 62,
	height: 34,
	padding: 7,
	'& .MuiSwitch-switchBase': {
		margin: 1,
		padding: 0,
		transform: 'translateX(6px)',
		'&.Mui-checked': {
			color: '#fff',
			transform: 'translateX(22px)',
			'& .MuiSwitch-thumb:before': {
				backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 25 25"><path fill="${encodeURIComponent(
					'#fff'
				)}" d="M 12 2 C 6.48 2 2 6.48 2 12 s 4.48 10 10 10 s 10 -4.48 10 -10 S 17.52 2 12 2 Z m -1 17.93 c -3.95 -0.49 -7 -3.85 -7 -7.93 c 0 -0.62 0.08 -1.21 0.21 -1.79 L 9 15 v 1 c 0 1.1 0.9 2 2 2 v 1.93 Z m 6.9 -2.54 c -0.26 -0.81 -1 -1.39 -1.9 -1.39 h -1 v -3 c 0 -0.55 -0.45 -1 -1 -1 H 8 v -2 h 2 c 0.55 0 1 -0.45 1 -1 V 7 h 2 c 1.1 0 2 -0.9 2 -2 v -0.41 c 2.93 1.19 5 4.06 5 7.41 c 0 2.08 -0.8 3.97 -2.1 5.39 Z"/></svg>')`,
			},
			'& + .MuiSwitch-track': {
				opacity: 1,
				backgroundColor: '#8796A5',
			},
		},
	},
	'& .MuiSwitch-thumb': {
		backgroundColor: '#C00734',
		width: 32,
		height: 32,
		'&:before': {
			content: "''",
			position: 'absolute',
			width: '100%',
			height: '100%',
			left: 0,
			top: 0,
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center',
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 25 25"><path fill="${encodeURIComponent(
				'#fff'
			)}" d="M 18 8 h -1 V 6 c 0 -2.76 -2.24 -5 -5 -5 S 7 3.24 7 6 v 2 H 6 c -1.1 0 -2 0.9 -2 2 v 10 c 0 1.1 0.9 2 2 2 h 12 c 1.1 0 2 -0.9 2 -2 V 10 c 0 -1.1 -0.9 -2 -2 -2 Z m -6 9 c -1.1 0 -2 -0.9 -2 -2 s 0.9 -2 2 -2 s 2 0.9 2 2 s -0.9 2 -2 2 Z m 3.1 -9 H 8.9 V 6 c 0 -1.71 1.39 -3.1 3.1 -3.1 c 1.71 0 3.1 1.39 3.1 3.1 v 2 Z"/></svg>')`,
		},
	},
	'& .MuiSwitch-track': {
		opacity: 1,
		backgroundColor: '#8796A5',
		borderRadius: 20 / 2,
	},
}));
