import { Button, Stack, List, ListItem } from '@mui/material';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux/es/exports';
import { signOutUser } from '../../utils/firebase/firebase.utils';

import { NavLink, ListButton } from './Navigation.styles';

export const LEARNING_NAV_LINK = ['Alphabet', 'Grammar', 'Vocabulary'];

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
			<Stack direction='row' spacing={5} justifyContent='space-around' alignItems='center'>
				<NavLink
					variant='h5'
					color='primary'
					underline='none'
					component='div'
					onClick={() => navigate('/')}
				>
					NKJ
				</NavLink>
				<NavLink variant='body1' color='primary' underline='hover' component='div'>
					Learning
					<List
						sx={{
							position: 'absolute',
							left: '-10px',
							display: 'none',
							zIndex: 1,
							backgroundColor: 'white',
							border: '1px solid var(--primary-color)',
						}}
					>
						{LEARNING_NAV_LINK.map((link, i) => (
							<ListItem key={i} disablePadding>
								<ListButton onClick={() => navigate(`/${link.toLowerCase()}`)}>{link}</ListButton>
							</ListItem>
						))}
					</List>
				</NavLink>
				<NavLink
					variant='body1'
					color='primary'
					underline='hover'
					component='div'
					onClick={() => navigate('/create')}
				>
					Create
				</NavLink>
				<NavLink
					variant='body1'
					color='primary'
					underline='hover'
					component='div'
					onClick={() => navigate('/exercise')}
				>
					Exercise
				</NavLink>
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
