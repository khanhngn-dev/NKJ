import { useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import { ToastrWarpper } from './Toastr.styles';

const Toastr = ({ severity, children, timeToLive, removeHandler }) => {
	const [out, setOut] = useState(false);
	let timeOutID;

	const onCloseHandler = () => {
		setOut(true);
		clearTimeout(timeOutID);
		setTimeout(() => removeHandler(), 1000);
	};

	useEffect(() => {
		setTimeout(() => {
			setOut(true);
		}, timeToLive * 1000);
		// eslint-disable-next-line
		timeOutID = setTimeout(() => removeHandler(), (timeToLive + 1) * 1000);
		// eslint-disable-next-line
	}, []);

	return (
		<ToastrWarpper className={out ? 'out' : 'in'}>
			<Alert severity={severity} variant='filled' onClose={onCloseHandler}>
				{children}
			</Alert>
		</ToastrWarpper>
	);
};

export default Toastr;
