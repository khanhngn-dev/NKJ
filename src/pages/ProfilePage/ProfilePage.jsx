import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNotificationAsync } from '../../redux/notification/notification.action';

import {
	Button,
	Modal,
	Grid,
	Box,
	Typography,
	TextField,
	Stack,
	MenuItem,
	InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SetSummary from '../../components/SetSummary/SetSummary.component';

import { deleteLearningSet, fetchAllLearningSets } from '../../utils/firebase/firebase.utils';
import CenterModal from '../../components/CenterModal/CenterModal.component';

const sortByList = [
	{
		text: 'Created Time',
		sort: (a, b) => a.created - b.created,
	},
	{
		text: 'Content Length',
		sort: (a, b) => a.content.length - b.content.length,
	},
	{
		text: 'Title',
		sort: (a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
	},
];

const ProfilePage = () => {
	const dispatch = useDispatch();
	const [sets, SetSets] = useState([]);
	const [filteredSets, setFilteredSets] = useState(sets);
	const [sortBy, setSortBy] = useState(0);
	const [searchTerm, setSearchTerm] = useState('');
	const [deleteID, setDeleteID] = useState('');
	const currentUser = useSelector((state) => state.user.currentUser);

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
			SetSets([...sets].filter((set) => set.id !== setID));
		} catch (e) {
			dispatch(setNotificationAsync({ message: 'Failed to delete set', severity: 'error' }));
		}
		closeDeleteHandler();
	};

	const fetchSetsAsync = useCallback(async (userID) => {
		const response = await fetchAllLearningSets(userID);
		if (!response) return;
		SetSets(response);
	}, []);

	const searchHandler = (e) => {
		setSearchTerm(e.target.value);
	};

	const sortByHandler = (e) => {
		setSortBy(e.target.value);
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
	}, [searchTerm, sets, sortBy]);

	return (
		<Stack
			direction='column'
			justifyContent='center'
			alignItems='center'
			sx={{ padding: '20px 40px' }}
			spacing={4}
		>
			<Stack direction='row' justifyContent='center' spacing={4} sx={{ width: '100%' }}>
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
			</Stack>
			<Box sx={{ width: '100%', maxWidth: '1200px', margin: 'auto' }}>
				<Grid container direction='row' flexWrap='wrap' spacing={4}>
					{filteredSets?.map((set) => (
						<Grid item key={set.id} xs={6}>
							<SetSummary key={set.id} set={set} deleteSetHandler={deleteSetHandler} />
						</Grid>
					))}
				</Grid>
			</Box>
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
		</Stack>
	);
};

export default ProfilePage;
