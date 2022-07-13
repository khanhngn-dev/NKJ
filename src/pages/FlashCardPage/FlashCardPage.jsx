import { useEffect, useState } from 'react';
import { useNavigate, useParams, generatePath } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { deleteLearningSet, fetchLearningSet } from '../../utils/firebase/firebase.utils';
import { Stack, LinearProgress, Typography, Button, Modal } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlipCard from '../../components/FlipCard/FlipCard.component';

import { timeConverter } from '../../utils/date/date';
import { setCurrentNotification } from '../../redux/notification/notification.slice';
import CenterModal from '../../components/CenterModal/CenterModal.component';

const FlashCardPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user.currentUser);
	const [flashCard, setFlashCard] = useState({});
	const [currentCard, setCurrentCard] = useState(0);
	const [showBack, setShowBack] = useState(false);
	const [deleteID, setDeleteID] = useState('');

	const deleteSetHandler = (setID) => {
		setDeleteID(setID);
	};

	const closeDeleteHandler = () => {
		setDeleteID('');
	};

	const confirmDeleteHandler = (setID) => {
		try {
			deleteLearningSet(setID, currentUser.uid);
			dispatch(
				setCurrentNotification({ message: 'Set deleted successfully', severity: 'success' })
			);
		} catch (e) {
			dispatch(setCurrentNotification({ message: 'Failed to delete set', severity: 'error' }));
		}
		closeDeleteHandler();
		navigate('/set');
	};

	const showBackHandler = () => {
		setShowBack(!showBack);
	};

	const nextCardHandler = () => {
		setShowBack(false);
		setTimeout(() => {
			if (currentCard === flashCard.content.length - 1) {
				setCurrentCard(0);
				return;
			}
			setCurrentCard(currentCard + 1);
		}, 200);
	};

	const previousCardHandler = () => {
		setShowBack(false);
		setTimeout(() => {
			if (currentCard === 0) {
				setCurrentCard(flashCard.content.length - 1);
				return;
			}
			setCurrentCard(currentCard - 1);
		}, 200);
	};

	useEffect(() => {
		const fetchSetAsync = async () => {
			const response = await fetchLearningSet(id, currentUser?.uid);
			if (!response) return;
			setFlashCard(response);
		};
		fetchSetAsync();
		// eslint-disable-next-line
	}, [currentUser]);

	return (
		<>
			<Stack
				direction='row'
				justifyContent='center'
				alignItems='center'
				sx={{ margin: 'auto', height: `calc(100vh - 60px)`, maxWidth: '1200px' }}
			>
				<Stack
					direction='column'
					justifyContent='center'
					alignItems='center'
					sx={{ flex: 3, padding: '20px', height: '100%', boxShadow: 1 }}
					spacing={4}
				>
					<Typography variant='h5' color='primary'>
						{flashCard?.title}
					</Typography>
					{flashCard?.tags?.length !== 0 && (
						<Stack direction='row' flexWrap='wrap' justifyContent='center' alignItems='center'>
							{flashCard?.tags?.map((tag, index) => (
								<Button key={index} variant='contained' sx={{ margin: '5px' }}>
									{tag}
								</Button>
							))}
						</Stack>
					)}
					<Typography variant='h6' color='primary'>
						{currentCard + 1} / {flashCard?.content?.length}
					</Typography>
					<div style={{ width: '100%' }}>
						<LinearProgress
							variant='determinate'
							value={((currentCard + 1) / flashCard?.content?.length) * 100}
							sx={{ height: '10px', borderRadius: '10px' }}
						/>
					</div>
					<Stack
						direction='row'
						justifyContent='center'
						alignItems='center'
						sx={{ alignSelf: 'center' }}
						spacing={2}
					>
						<Button
							variant='contained'
							onClick={() => {
								navigate(
									generatePath('/create/:id', {
										id,
									})
								);
							}}
						>
							<EditIcon />
						</Button>
						<Button variant='contained' onClick={() => deleteSetHandler(id)}>
							<DeleteIcon />
						</Button>
					</Stack>
					<Typography variant='h6' color='primary'>
						Created: {timeConverter(flashCard?.created)}
					</Typography>
				</Stack>
				<Stack
					direction='column'
					justifyContent='center'
					alignItems='center'
					sx={{ flex: 9, height: '100%' }}
				>
					<FlipCard
						showBack={showBack}
						showBackHandler={showBackHandler}
						front={
							<Typography variant='h5' color='white'>
								{flashCard.title ? flashCard.content[currentCard].term : 'Term'}
							</Typography>
						}
						back={
							<Typography variant='h5' color='white'>
								{flashCard.title ? flashCard.content[currentCard].meaning : 'Meaning'}
							</Typography>
						}
					/>
					<Stack direction='row' justifyContent='center' alignItems='center' spacing={2}>
						<Button onClick={previousCardHandler}>
							<ArrowBackIosNewIcon />
						</Button>
						<Typography variant='h6' color='primary'>
							{currentCard + 1} / {flashCard?.content?.length}
						</Typography>
						<Button onClick={nextCardHandler}>
							<ArrowForwardIosIcon />
						</Button>
					</Stack>
				</Stack>
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

export default FlashCardPage;
