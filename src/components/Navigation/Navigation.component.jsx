import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { signOutUser } from '../../utils/firebase/firebase.utils';

import { Button, Stack, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';

import ROUTE from '../../routers/Routes';

import { NavLink } from './Navigation.styles';

export const LEARNING_NAV_LINK = ['Alphabet', 'Grammar', 'Vocabulary', 'Set'];

const Navigation = () => {
	const navigate = useNavigate();
	const currentUser = useSelector((state) => state.user.currentUser);
	const [anchorEl, setAnchorEl] = useState(null);
	const [xlAnchorEl, setXLAnchorEl] = useState(null);

	const onOpenHandler = (e) => setAnchorEl(e.currentTarget);
	const onCloseHandler = () => setAnchorEl(null);
	const onXLOpenHandler = (e) => setXLAnchorEl(e.currentTarget);
	const onXLCloseHandler = () => setXLAnchorEl(null);

	return (
		<Stack
			direction='row'
			justifyContent='space-between'
			alignItems='center'
			sx={{ height: '60px', width: '100%', padding: '10px 20px', boxShadow: 1 }}
		>
			<Stack
				direction='row'
				spacing={5}
				justifyContent='space-around'
				alignItems='center'
				sx={{ display: { xs: 'none', sm: 'flex' } }}
			>
				<NavLink
					variant='h5'
					color='primary'
					underline='none'
					component='div'
					onClick={() => navigate(ROUTE.HOMEPAGE)}
				>
					NKJ
				</NavLink>
				<NavLink
					variant='body1'
					color='primary'
					underline='hover'
					component='div'
					onClick={onXLOpenHandler}
				>
					Learning
				</NavLink>
				<Menu anchorEl={xlAnchorEl} open={Boolean(xlAnchorEl)} onClose={onXLCloseHandler}>
					{LEARNING_NAV_LINK.map((link, i) => (
						<MenuItem
							key={i}
							onClick={() => {
								onXLCloseHandler();
								navigate(`/${link.toLowerCase()}`);
							}}
							sx={{ color: 'var(--primary-color)', fontWeight: 700, padding: '10px 20px' }}
						>
							{link}
						</MenuItem>
					))}
				</Menu>
				<NavLink
					variant='body1'
					color='primary'
					underline='hover'
					component='div'
					onClick={() => navigate(ROUTE.CREATE)}
				>
					Create
				</NavLink>
				<NavLink
					variant='body1'
					color='primary'
					underline='hover'
					component='div'
					onClick={() => navigate(ROUTE.EXERCISE)}
				>
					Exercise
				</NavLink>
			</Stack>
			<NavLink
				sx={{ display: { xs: 'initial', sm: 'none' } }}
				variant='h5'
				color='primary'
				underline='none'
				component='div'
				onClick={() => navigate(ROUTE.HOMEPAGE)}
			>
				NKJ
			</NavLink>
			<Stack direction='row' justifyContent='center' alignItems='center' spacing={2}>
				{currentUser ? (
					<Stack direction='row' justifyContent='center' alignItems='center' spacing={2}>
						<AccountCircleIcon
							sx={{ color: 'var(--primary-color)', cursor: 'pointer' }}
							onClick={() => navigate(ROUTE.PROFILE)}
						/>
						<Button
							type='button'
							variant='outlined'
							sx={{
								fontWeight: 700,
								display: { xs: 'none', sm: 'initial' },
							}}
							onClick={signOutUser}
						>
							Sign Out
						</Button>
					</Stack>
				) : (
					<Stack
						direction='row'
						spacing={2}
						justifyContent='center'
						alignItems='center'
						display={{ xs: 'none', sm: 'flex' }}
					>
						<Button
							type='button'
							variant='outlined'
							color='primary'
							sx={{
								fontWeight: 700,
							}}
							onClick={() => navigate(ROUTE.SIGNIN)}
						>
							Sign in
						</Button>
						<Button
							type='button'
							variant='contained'
							sx={{
								fontWeight: 700,
							}}
							onClick={() => navigate(ROUTE.SIGNUP)}
						>
							Sign up
						</Button>
					</Stack>
				)}
				<Button sx={{ display: { xs: 'flex', sm: 'none' } }} onClick={onOpenHandler}>
					<MenuIcon />
				</Button>
				<Menu
					// sx={{
					// 	position: 'absolute',
					// 	top: '40px',
					// 	right: '10px',
					// 	display: menu ? 'initial' : 'none',
					// 	zIndex: 2000,
					// 	backgroundColor: 'white',
					// 	border: '1px solid var(--primary-color)',
					// }}
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={onCloseHandler}
				>
					{LEARNING_NAV_LINK.map((link, i) => (
						<MenuItem
							key={i}
							onClick={() => {
								onCloseHandler();
								navigate(`/${link.toLowerCase()}`);
							}}
							sx={{ color: 'var(--primary-color)', fontWeight: 700 }}
						>
							{link}
						</MenuItem>
					))}
					{currentUser ? (
						<MenuItem sx={{ justifyContent: 'center' }}>
							<Button
								type='button'
								variant='outlined'
								sx={{
									fontWeight: 700,
								}}
								onClick={() => {
									onCloseHandler();
									signOutUser();
								}}
							>
								Sign Out
							</Button>
						</MenuItem>
					) : (
						<>
							<MenuItem sx={{ justifyContent: 'center' }}>
								<Button
									type='button'
									variant='outlined'
									color='primary'
									sx={{
										fontWeight: 700,
									}}
									onClick={() => {
										onCloseHandler();
										navigate(ROUTE.SIGNIN);
									}}
								>
									Sign in
								</Button>
							</MenuItem>
							<MenuItem sx={{ justifyContent: 'center', marginTop: '10px' }}>
								<Button
									type='button'
									variant='contained'
									sx={{
										fontWeight: 700,
									}}
									onClick={() => {
										onCloseHandler();
										navigate(ROUTE.SIGNUP);
									}}
								>
									Sign up
								</Button>
							</MenuItem>
						</>
					)}
				</Menu>
			</Stack>
		</Stack>
	);
};

export default Navigation;
