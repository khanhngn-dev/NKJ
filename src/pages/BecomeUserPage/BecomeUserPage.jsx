import { useNavigate } from 'react-router';
import { Link, Stack, Typography } from '@mui/material';

const BecomeUserPage = () => {
	const navigate = useNavigate();
	return (
		<Stack
			direction='column'
			spacing={4}
			justifyContent='center'
			alignItems='center'
			sx={{ height: 'calc(100vh - 60px)' }}
		>
			<Typography variant='h5'>Become a user to use this feature</Typography>
			<Link
				variant='h5'
				color='primary'
				underline='hover'
				component='div'
				onClick={() => navigate('/signup')}
				sx={{
					cursor: 'pointer',
				}}
			>
				Sign Up
			</Link>
			<Typography variant='h5'>Or if you already have an account</Typography>
			<Link
				variant='h5'
				color='primary'
				underline='hover'
				component='div'
				onClick={() => navigate('/signin')}
				sx={{
					cursor: 'pointer',
				}}
			>
				Sign In
			</Link>
			<Link
				variant='h5'
				color='primary'
				underline='hover'
				component='div'
				onClick={() => navigate('/')}
				sx={{
					cursor: 'pointer',
				}}
			>
				<Typography variant='h5'>Return to Home page</Typography>
			</Link>
		</Stack>
	);
};

export default BecomeUserPage;
