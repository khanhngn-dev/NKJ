import { Alert, Snackbar } from '@mui/material';

const Notification = ({ severity, children, timeToLive, removeHandler }) => {
	return (
		<Snackbar
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={Boolean(severity)}
			autoHideDuration={timeToLive * 1000}
			onClose={removeHandler}
		>
			<Alert severity={severity} variant='filled' onClose={removeHandler}>
				{children}
			</Alert>
		</Snackbar>
	);
};

export default Notification;
