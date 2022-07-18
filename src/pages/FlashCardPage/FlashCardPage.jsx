import { useEffect, useState } from 'react';
import { useNavigate, useParams, generatePath } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import {
	deleteLearningSet,
	fetchLearningSet,
	fetchPublicLearningSet,
} from '../../utils/firebase/firebase.utils';
import { Stack, LinearProgress, Typography, Button, Modal, Skeleton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlipCard from '../../components/FlipCard/FlipCard.component';

import { timeConverter } from '../../utils/date/date';
import { setNotificationAsync } from '../../redux/notification/notification.action';
import CenterModal from '../../components/CenterModal/CenterModal.component';

const FlashCardPage = () => {
	const { id, privacy } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user.currentUser);
	const [flashCard, setFlashCard] = useState({});
	const [currentCard, setCurrentCard] = useState(0);
	const [showBack, setShowBack] = useState(false);
	const [loading, setLoading] = useState(true);
	const [deleteID, setDeleteID] = useState('');

	const deleteSetHandler = (setID) => {
		setDeleteID(setID);
	};

	const closeDeleteHandler = () => {
		setDeleteID('');
	};

	const confirmDeleteHandler = async (setID) => {
		try {
			await deleteLearningSet(setID, currentUser.uid);
			dispatch(setNotificationAsync({ message: 'Set deleted successfully', severity: 'success' }));
		} catch (e) {
			dispatch(setNotificationAsync({ message: 'Failed to delete set', severity: 'error' }));
			return;
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
			if (privacy) {
				const response = await fetchPublicLearningSet(id);
				if (!response) {
					setLoading(false);
					return;
				}
				setFlashCard(response);
			} else {
				const response = await fetchLearningSet(id, currentUser?.uid);
				if (!response) {
					setLoading(false);
					return;
				}
				setFlashCard(response);
			}
			setLoading(false);
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
				sx={{
					margin: 'auto',
					maxWidth: '1200px',
					position: 'relative',
					marginTop: '120px',
				}}
			>
				<Stack
					direction='column'
					justifyContent='center'
					alignItems='center'
					sx={{
						flex: 3,
						padding: '20px',
						height: '100%',
						boxShadow: 1,
						position: 'sticky',
						alignSelf: 'flex-start',
						top: 0,
					}}
					spacing={4}
				>
					<Typography variant='h5' color='primary' sx={{ width: '100%' }} textAlign='center'>
						{loading ? <Skeleton /> : flashCard?.title}
					</Typography>
					{loading ? (
						<Stack direction='row' flexWrap='wrap' alignItems='center' sx={{ gap: '5px' }}>
							{[...new Array(6)].map((_, index) => (
								<Skeleton
									key={index}
									variant='rectangular'
									width={50}
									height={30}
									sx={{ marginTop: '5px', marginLeft: 0, minWidth: '50px', flex: 1 }}
								/>
							))}
						</Stack>
					) : (
						flashCard?.tags?.length !== 0 && (
							<Stack direction='row' flexWrap='wrap' justifyContent='center' alignItems='center'>
								{flashCard?.tags?.map((tag, index) => (
									<Button key={index} variant='contained' sx={{ margin: '5px' }}>
										{tag}
									</Button>
								))}
							</Stack>
						)
					)}
					<Typography
						variant='h6'
						color='primary'
						style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
					>
						<span>{currentCard + 1}</span>
						<span> / </span>
						{loading ? (
							<Skeleton component='span' width='1.25rem' height={32} />
						) : (
							flashCard?.content?.length
						)}
					</Typography>
					<div style={{ width: '100%' }}>
						<LinearProgress
							variant='determinate'
							value={((currentCard + 1) / flashCard?.content?.length) * 100}
							sx={{ height: '10px', borderRadius: '10px' }}
						/>
					</div>
					{flashCard?.user === currentUser?.uid && (
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
					)}
					<Typography variant='h6' color='primary' sx={{ width: '100%' }} textAlign='center'>
						{loading ? <Skeleton /> : `Created: ${timeConverter(flashCard?.created)}`}
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
							loading ? (
								<Skeleton width='100%' />
							) : (
								<Typography variant='h5' color='white'>
									{flashCard.title ? flashCard.content[currentCard].term : 'Term'}
								</Typography>
							)
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
