import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { setNotificationAsync } from '../../redux/notification/notification.action';

import {
	Avatar,
	Typography,
	Stack,
	Badge,
	Grid,
	Button,
	Modal,
	Divider,
	Chip,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {
	deleteLearningSet,
	fetchMostPopularSets,
	fetchUserInfo,
} from '../../utils/firebase/firebase.utils';
import SetSummary, { SkeletonSummary } from '../../components/SetSummary/SetSummary.component';
import CenterModal from '../../components/CenterModal/CenterModal.component';
import ROUTE from '../../routers/Routes';

const ProfilePage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { uid } = useParams();
	const currentUser = useSelector((state) => state.user.currentUser);
	const [popularSet, setPopularSet] = useState([]);
	const [loading, setLoading] = useState(true);
	const [deleteID, setDeleteID] = useState('');
	const [profile, setProfile] = useState({});

	const fetchAllAsync = useCallback(async () => {
		try {
			let profile, set;
			if (uid) {
				set = await fetchMostPopularSets(uid);
				profile = await fetchUserInfo(uid);
			} else if (currentUser) {
				set = await fetchMostPopularSets(currentUser.uid);
				profile = await fetchUserInfo(currentUser.uid);
			} else {
				navigate(ROUTE.SIGNUP);
			}
			if (!profile) {
				setLoading(false);
				return;
			}
			set && setPopularSet(set);
			setProfile(profile);
			setLoading(false);
		} catch (e) {
			setLoading(false);
			dispatch(
				setNotificationAsync({ message: 'Failed to fetch most popular sets', severity: 'error' })
			);
		}
		// eslint-disable-next-line
	}, []);

	const deleteSetHandler = (setID) => {
		setDeleteID(setID);
	};

	const closeDeleteHandler = () => {
		setDeleteID('');
	};

	const confirmDeleteHandler = (setID) => {
		try {
			deleteLearningSet(setID, currentUser.uid);
			dispatch(setNotificationAsync({ message: 'Set deleted successfully', severity: 'success' }));
			setLoading(true);
			fetchAllAsync();
		} catch (e) {
			dispatch(setNotificationAsync({ message: 'Failed to delete set', severity: 'error' }));
		}
		closeDeleteHandler();
	};

	useEffect(() => {
		fetchAllAsync();
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<Stack
				sx={{
					padding: '40px',
					maxWidth: '1200px',
					margin: 'auto',
				}}
			>
				<Stack
					sx={{
						flexDirection: { xs: 'column', sm: 'row' },
						padding: 4,
					}}
					gap={4}
					justifyContent='flex-start'
					alignItems='center'
				>
					<Badge
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						overlap='circular'
						badgeContent={
							<Avatar sx={{ bgcolor: 'var(--primary-color)', width: 50, height: 50 }}>
								<CameraAltIcon />
							</Avatar>
						}
					>
						<Avatar
							src={profile.photoURL}
							sx={{
								width: 200,
								height: 200,
								position: 'relative',
								'&::before': {
									display: 'none',
									content: '""',
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%',
									backgroundColor: '#3434345a',
								},
								'&:hover::before': {
									display: 'initial',
								},
							}}
						/>
					</Badge>
					<Stack direction='column' gap={4} justifyContent='center' alignItems='center'>
						<Typography variant='h4' color='primary'>
							{profile.displayName || profile.email}
						</Typography>
					</Stack>
				</Stack>
				<Grid container direction='row' flexWrap='wrap' spacing={4}>
					{popularSet?.length !== 0 && (
						<Grid item xs={12}>
							<Divider flexItem>
								<Chip
									color='primary'
									sx={{ padding: 3 }}
									label={
										<Typography variant='h5' color='white'>
											Highest rating sets
										</Typography>
									}
								/>
							</Divider>
						</Grid>
					)}
					{loading
						? [...new Array(6)].map((_, index) => (
								<Grid item xs={12} sm={12} md={6} key={index}>
									<SkeletonSummary editable={false} />
								</Grid>
						  ))
						: popularSet.map((set) => (
								<Grid key={set.id} item xs={12} sm={12} md={6}>
									<SetSummary
										editable={currentUser !== null && currentUser?.uid === set.user.uid}
										set={set}
										deleteSetHandler={deleteSetHandler}
									/>
								</Grid>
						  ))}
				</Grid>
			</Stack>
			<Modal open={Boolean(deleteID)} onClose={closeDeleteHandler}>
				<CenterModal
					style={{
						display: 'flex',
						flexFlow: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						gap: '20px',
					}}
				>
					<Typography variant='h6' color='primary' textAlign='center'>
						Confirm delete
					</Typography>
					<Typography variant='body1' color='primary' textAlign='center'>
						THIS ACTION IS IRREVERSIBLE
					</Typography>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							gap: '20px',
						}}
					>
						<Button variant='contained' onClick={() => confirmDeleteHandler(deleteID)}>
							Delete
						</Button>
						<Button variant='outlined' onClick={closeDeleteHandler}>
							Cancel
						</Button>
					</div>
				</CenterModal>
			</Modal>
		</>
	);
};

export default ProfilePage;
