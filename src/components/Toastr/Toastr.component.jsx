import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from '@mui/material';
import { ToastrWarpper } from './Toastr.styles';

const Toastr = ({ severity, children, timeToLive }) => {
	const [out, setOut] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setOut(true);
		}, timeToLive * 1000);
	}, []);

	return (
		<ToastrWarpper className={out ? 'out' : 'in'}>
			<Alert severity={severity} variant='filled'>
				{children}
			</Alert>
		</ToastrWarpper>
	);
};

export default Toastr;
