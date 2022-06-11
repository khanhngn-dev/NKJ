import { Button, Stack, Link } from '@mui/material';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux/es/exports';
import { signOutUser } from '../../utils/firebase/firebase.utils';

const Navigation = () => {
	const navigate = useNavigate();
	const currentUser = useSelector((state) => state.user.currentUser);

	return (
		<Stack
			direction='row'
			spacing={2}
			justifyContent='space-between'
			alignItems='center'
			sx={{ height: '60px', width: '100%', padding: '10px 20px' }}
		>
			<Stack direction='row' spacing={2} justifyContent='space-around' alignItems='center'>
				<Link
					variant='h5'
					color='primary'
					underline='none'
					sx={{
						fontWeight: 700,
						cursor: 'pointer',
					}}
					onClick={() => navigate('/')}
				>
					NKJ
				</Link>
				<Link
					variant='body1'
					color='primary'
					underline='hover'
					sx={{
						fontWeight: 700,
						cursor: 'pointer',
					}}
					onClick={() => navigate('/learning')}
				>
					Learning
				</Link>
				<Link
					variant='body1'
					color='primary'
					underline='hover'
					sx={{
						fontWeight: 700,
						cursor: 'pointer',
					}}
					onClick={() => navigate('/create')}
				>
					Create
				</Link>
				<Link
					variant='body1'
					color='primary'
					underline='hover'
					sx={{
						fontWeight: 700,
						cursor: 'pointer',
					}}
					onClick={() => navigate('/exercise')}
				>
					Exercise
				</Link>
			</Stack>
			{currentUser ? (
				<Button
					type='button'
					variant='outlined'
					sx={{
						fontWeight: 700,
					}}
					onClick={signOutUser}
				>
					Sign Out
				</Button>
			) : (
				<Stack direction='row' spacing={2}>
					<Button
						type='button'
						variant='outlined'
						color='primary'
						sx={{
							fontWeight: 700,
						}}
						onClick={() => navigate('/signin')}
					>
						Sign in
					</Button>
					<Button
						type='button'
						variant='contained'
						sx={{
							fontWeight: 700,
						}}
						onClick={() => navigate('/signup')}
					>
						Sign up
					</Button>
				</Stack>
			)}
		</Stack>
	);
};

export default Navigation;
