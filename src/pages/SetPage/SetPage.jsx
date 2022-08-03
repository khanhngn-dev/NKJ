import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNotificationAsync } from '../../redux/notification/notification.action';
import { useNavigate } from 'react-router';

import {
	Button,
	Modal,
	Grid,
	Typography,
	TextField,
	Stack,
	MenuItem,
	InputAdornment,
	Divider,
	Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SetSummary, { SkeletonSummary } from '../../components/SetSummary/SetSummary.component';

import {
	DEFAULT_MAX_SET,
	deleteLearningSet,
	fetchAllLearningSets,
	fetchAllPublicLearningSets,
} from '../../utils/firebase/firebase.utils';
import CenterModal from '../../components/CenterModal/CenterModal.component';
import { SpinnerContainer } from '../../components/Spinner/Spinner.styles';
import ROUTE from '../../routers/Routes';

const sortByList = [
	{
		text: 'Created Time',
		sort: (a, b) => a.created - b.created,
	},
	{
		text: 'Updated Time',
		sort: (a, b) => a.updated - b.updated,
	},
	{
		text: 'Content Length',
		sort: (a, b) => a.content.length - b.content.length,
	},
	{
		text: 'Title',
		sort: (a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
	},
	{
		text: 'Rating',
		sort: (a, b) => a.ratings.stars - b.ratings.stars,
	},
];

const SetPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [sets, setSets] = useState([]);
	const [filteredSets, setFilteredSets] = useState(sets);
	const [publicSets, setPublicSets] = useState([]);
	const [filteredPublicSets, setFilteredPublicSets] = useState(publicSets);
	const [sortBy, setSortBy] = useState(0);
	const [fetchLength, setFetchLength] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [deleteID, setDeleteID] = useState('');
	const [loading, setLoading] = useState(true);
	const [sortAsc, setSortAsc] = useState(true);
	const currentUser = useSelector((state) => state.user.currentUser);

	const deleteSetHandler = (setID) => {
		setDeleteID(setID);
	};

	const closeDeleteHandler = () => {
		setDeleteID('');
	};

	const fetchSetsAsync = useCallback(async (userID) => {
		const response = await fetchAllLearningSets(userID);
		const publicResponse = await fetchAllPublicLearningSets();
		if (publicResponse) {
			setPublicSets(publicResponse);
		}
		if (response) {
			setSets(response);
		}
		setLoading(false);
	}, []);

	const confirmDeleteHandler = (setID) => {
		try {
			deleteLearningSet(setID, currentUser.uid);
			dispatch(setNotificationAsync({ message: 'Set deleted successfully', severity: 'success' }));
			setLoading(true);
			fetchSetsAsync(currentUser.uid);
		} catch (e) {
			dispatch(setNotificationAsync({ message: 'Failed to delete set', severity: 'error' }));
		}
		closeDeleteHandler();
	};

	const searchHandler = (e) => {
		setSearchTerm(e.target.value);
	};

	const sortByHandler = (e) => {
		setSortBy(e.target.value);
	};

	const fetchMorePublicSetsHandler = async () => {
		setLoading(true);
		setFetchLength(fetchLength + 1);
		const response = await fetchAllPublicLearningSets((fetchLength + 1) * DEFAULT_MAX_SET);
		if (!response) {
			setLoading(false);
			return;
		}
		setPublicSets(response);
		setLoading(false);
	};

	const sortDirectionHandler = () => {
		setSortAsc(!sortAsc);
		setFilteredPublicSets([...filteredPublicSets].reverse());
		setFilteredSets([...filteredSets].reverse());
	};

	useEffect(() => {
		fetchSetsAsync(currentUser?.uid);
		// eslint-disable-next-line
	}, [currentUser]);

	useEffect(() => {
		const upperTerm = searchTerm.toUpperCase();
		setFilteredSets(
			sets
				.filter(
					(set) =>
						set.title.toUpperCase().includes(upperTerm) ||
						set.tags.some((tag) => tag.includes(upperTerm))
				)
				.sort((a, b) => sortByList[sortBy].sort(a, b))
		);
		setFilteredPublicSets(
			publicSets
				.filter(
					(set) =>
						set.title.toUpperCase().includes(upperTerm) ||
						set.tags.some((tag) => tag.includes(upperTerm))
				)
				.sort((a, b) => sortByList[sortBy].sort(a, b))
		);
	}, [searchTerm, sets, sortBy, publicSets]);

	return (
		<>
			<Stack
				direction='column'
				justifyContent='center'
				alignItems='center'
				sx={{ padding: '40px', maxWidth: '1200px', margin: 'auto' }}
				spacing={4}
			>
				<Stack
					justifyContent='center'
					alignItems='center'
					gap={4}
					sx={{ width: '100%', flexFlow: { xs: 'column', sm: 'row' } }}
				>
					<TextField
						label='Search Learning Sets'
						value={searchTerm}
						onChange={searchHandler}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>
					<TextField
						select
						value={sortBy}
						onChange={sortByHandler}
						label='Sort by'
						sx={{ width: '20ch' }}
					>
						{sortByList.map((item, index) => (
							<MenuItem value={index} key={index}>
								{item.text}
							</MenuItem>
						))}
					</TextField>
					<Button
						sx={{
							minWidth: '56px',
							minHeight: '56px',
							borderRadius: '50%',
							transform: `rotate(${sortAsc ? 0 : 180}deg)`,
							transition: 'all 0.25s ease-in-out',
						}}
						color='primary'
						variant='outlined'
						onClick={sortDirectionHandler}
					>
						<ArrowUpwardIcon size='large' />
					</Button>
				</Stack>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexFlow: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						gap: '40px',
					}}
				>
					<Divider flexItem textAlign='left'>
						<Chip
							color='primary'
							sx={{ padding: 3 }}
							label={
								<Typography variant='h5' color='white'>
									Public Set
								</Typography>
							}
						/>
					</Divider>
					<Grid container direction='row' flexWrap='wrap' spacing={4}>
						{loading ? (
							[...new Array(6)].map((_, index) => (
								<Grid item key={index} xs={12} sm={12} md={6}>
									<SkeletonSummary editable={false} />
								</Grid>
							))
						) : filteredPublicSets.length === 0 ? (
							<Grid item xs={12}>
								<Typography variant='h5' color='primary' textAlign='center'>
									Empty
								</Typography>
							</Grid>
						) : (
							<>
								{filteredPublicSets?.map((set, index) => (
									<Grid item key={set.id || index} xs={12} sm={12} md={6}>
										<SetSummary
											editable={currentUser !== null && currentUser?.uid === set.user.uid}
											key={set.id}
											set={set}
											loading={loading}
											deleteSetHandler={deleteSetHandler}
										/>
									</Grid>
								))}
								<Grid
									item
									xs={12}
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										cursor: 'pointer',
									}}
									onClick={fetchMorePublicSetsHandler}
								>
									<Divider flexItem>
										<Typography color='primary' variant='body1'>
											{loading ? (
												<SpinnerContainer style={{ width: '30px', height: '30px' }} as='span' />
											) : (
												'Fetch more sets'
											)}
										</Typography>
									</Divider>
								</Grid>
							</>
						)}
					</Grid>
					{currentUser ? (
						<>
							<Divider flexItem textAlign='left'>
								<Chip
									color='primary'
									sx={{ padding: 3 }}
									label={
										<Typography variant='h5' color='white'>
											Private Set
										</Typography>
									}
								/>
							</Divider>
							<Grid container direction='row' flexWrap='wrap' spacing={4}>
								{loading ? (
									[...new Array(6)].map((_, index) => (
										<Grid item key={index} xs={12} sm={12} md={6}>
											<SkeletonSummary editable={true} />
										</Grid>
									))
								) : filteredSets.length === 0 ? (
									<Grid item xs={12}>
										<Typography variant='h5' color='primary' textAlign='center'>
											Empty
										</Typography>
									</Grid>
								) : (
									filteredSets?.map((set, index) => (
										<Grid item key={set.id || index} xs={12} sm={12} md={6}>
											<SetSummary
												editable={currentUser !== null && currentUser?.uid === set.user.uid}
												key={set.id}
												set={set}
												loading={loading}
												deleteSetHandler={deleteSetHandler}
											/>
										</Grid>
									))
								)}
							</Grid>
						</>
					) : (
						<>
							<Divider flexItem>
								<Typography variant='body1' color='primary'>
									OR
								</Typography>
							</Divider>
							<Typography variant='h5'>
								<span
									onClick={() => navigate(ROUTE.SIGNUP)}
									style={{ color: 'var(--primary-color)', cursor: 'pointer' }}
								>
									Sign up
								</span>{' '}
								to create your own sets
							</Typography>
						</>
					)}
				</div>
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

export default SetPage;
