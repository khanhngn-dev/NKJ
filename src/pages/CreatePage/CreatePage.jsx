import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { Stack, TextField, Button, Modal } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SettingsIcon from '@mui/icons-material/Settings';
import ClearIcon from '@mui/icons-material/Clear';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Set from '../../components/Set/Set.component';
import CenterModal from '../../components/CenterModal/CenterModal.component';
import { SpinnerContainer } from '../../components/Spinner/Spinner.styles';
import { MaterialUISwitch } from './CreatePage.styles';

import { v1 as uuidv1 } from 'uuid';

import { addLearningSet, fetchLearningSet } from '../../utils/firebase/firebase.utils';
import { setCurrentNotification } from '../../redux/notification/notification.slice';

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const Tag = ({ name, removeTagHandler }) => (
	<Button
		variant='contained'
		size='small'
		onClick={() => removeTagHandler(name)}
		endIcon={<ClearIcon />}
		sx={{ margin: '5px' }}
	>
		<div>{name}</div>
	</Button>
);

const SettingModal = ({
	openSettingModal,
	closeSettingHandler,
	privacy,
	tags,
	tag,
	privacyHandler,
	addTagHandler,
	removeTagHandler,
	tagChangeHandler,
}) => (
	<Modal open={openSettingModal} onClose={closeSettingHandler} keepMounted>
		<CenterModal
			style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				backgroundColor: '#fff',
				padding: '20px',
				borderRadius: '10px',
			}}
		>
			<Stack direction='column' spacing={3} alignItems='center' justifyContent='center'>
				<Stack direction='row' spacing={2} alignItems='center' sx={{ fontWeight: 700 }}>
					<label style={{ color: !privacy ? '#C00734' : 'black' }}>Private</label>
					<MaterialUISwitch checked={privacy} onChange={privacyHandler} />
					<label style={{ color: privacy ? '#C00734' : 'black' }}>Public</label>
				</Stack>
				<Stack direction='row' flexWrap='wrap' justifyContent='center' alignItems='center'>
					{tags.map((tag, index) => (
						<Tag key={index} removeTagHandler={removeTagHandler} name={tag} />
					))}
				</Stack>
				<Stack direction='row' spacing={2}>
					<TextField label='Tag' value={tag} onChange={tagChangeHandler}></TextField>
					<Button
						variant='contained'
						type='button'
						startIcon={<AddBoxIcon />}
						onClick={addTagHandler}
					>
						Tag
					</Button>
				</Stack>
			</Stack>
		</CenterModal>
	</Modal>
);

const CreatePage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id } = useParams();
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(false);
	const [openSettingModal, setOpenSettingModal] = useState(false);
	const [tag, setTag] = useState('');
	const [tags, setTags] = useState([]);
	const [privacy, setPrivacy] = useState(false);
	const [title, setTitle] = useState('');
	const currentUser = useSelector((state) => state.user.currentUser);

	const onSubmitHandler = (e) => {
		e.preventDefault();
		if (cards.length === 0) {
			dispatch(setCurrentNotification({ message: 'The set is empty', severity: 'warning' }));
		} else if (cards.every((card) => card.term && card.meaning)) {
			// Send to firebase
			try {
				setLoading(true);
				dispatch(setCurrentNotification({ message: 'Creating set...', severity: 'info' }));
				addLearningSet(
					{
						id: id || uuidv1(),
						content: cards,
						tags,
						privacy,
						title,
						created: Date.now(),
					},
					currentUser.uid
				);
				setLoading(false);
				dispatch(
					setCurrentNotification({ message: 'Set created successfully', severity: 'success' })
				);
				navigate('/set');
			} catch (e) {
				setLoading(false);
				dispatch(setCurrentNotification({ message: e.message, severity: 'error' }));
			}
		} else {
			dispatch(
				setCurrentNotification({
					message: 'All terms and meanings must be filled in',
					severity: 'warning',
				})
			);
		}
	};

	const addCardHandler = () => {
		setCards([
			...cards,
			{
				id: uuidv1(),
				term: '',
				meaning: '',
			},
		]);
	};

	const onChangeHandler = (e, id) => {
		const cardToUpdate = cards.find((card) => card.id === id);
		setCards(
			cards.map((card) =>
				card.id === id ? { ...cardToUpdate, [e.target.name]: e.target.value } : card
			)
		);
	};

	const removeHandler = (id) => {
		setCards(cards.filter((card) => card.id !== id));
		dispatch(setCurrentNotification({ message: 'Card delete successfully', severity: 'success' }));
	};

	const onDragEnd = (result) => {
		if (!result.destination) {
			return;
		}
		const items = reorder(cards, result.source.index, result.destination.index);

		setCards(items);
	};

	const openSettingHandler = () => {
		setOpenSettingModal(true);
	};

	const closeSettingHandler = () => {
		setOpenSettingModal(false);
	};

	const tagChangeHandler = (e) => {
		setTag(e.target.value);
	};

	const addTagHandler = (e) => {
		e.preventDefault();
		if (!tag) {
			dispatch(
				setCurrentNotification({
					message: 'Cannot set empty tag',
					severity: 'warning',
				})
			);
			return;
		}
		const addedTag = tag.toUpperCase();
		if (!tags.every((tag) => tag !== addedTag)) {
			dispatch(
				setCurrentNotification({
					message: 'Tag already exists',
					severity: 'warning',
				})
			);
			return;
		}
		setTags([...tags, addedTag]);
		setTag('');
	};

	const removeTagHandler = (removedTag) => {
		setTags([...tags].filter((tag) => tag !== removedTag));
	};

	const privacyHandler = () => {
		setPrivacy(!privacy);
	};

	const titleHandler = (e) => {
		setTitle(e.target.value);
	};

	useEffect(() => {
		if (!id) navigate('/create');
		const fetchSetAsync = async () => {
			try {
				const response = await fetchLearningSet(id, currentUser?.uid);
				if (!response) return;
				setCards(response.content);
				setPrivacy(response.privacy);
				setTags(response.tags);
				setTitle(response.title);
			} catch (e) {
				dispatch(
					setCurrentNotification({ message: `Cannot fetch set with ID: ${id}`, state: 'error' })
				);
			}
		};
		fetchSetAsync();
		// eslint-disable-next-line
	}, [currentUser]);

	return (
		<>
			<Stack
				direction='column'
				sx={{ padding: '20px 40px', maxWidth: '1200px', margin: ' auto' }}
				spacing={4}
				justifyContent='center'
				alignItems='center'
			>
				<form onSubmit={onSubmitHandler}>
					<Stack direction='row' justifyContent='center' alignItems='center' spacing={2}>
						<TextField
							required
							label='Title'
							variant='standard'
							value={title}
							onChange={titleHandler}
						/>
						<Button onClick={openSettingHandler}>
							<SettingsIcon color='primary' />
						</Button>
						<Button
							type='submit'
							variant='contained'
							endIcon={!loading && <SendIcon />}
							disabled={loading}
							sx={{ height: '40px' }}
						>
							{loading ? <SpinnerContainer style={{ width: '30px', height: '30px' }} /> : 'Create'}
						</Button>
					</Stack>
				</form>
				{cards.length === 0 ? (
					<div>Placeholder</div>
				) : (
					<DragDropContext onDragEnd={onDragEnd}>
						<Droppable droppableId='setsList'>
							{(provided) => (
								<Stack
									direction='column'
									sx={{
										width: '80%',
										backgroundColor: '#C00734',
										borderRadius: '10px',
										padding: '20px',
									}}
									alignItems='center'
									{...provided.droppableProps}
									ref={provided.innerRef}
								>
									{cards.map((card, index) => (
										<Draggable key={card.id} draggableId={card.id} index={index}>
											{(provided, snapshot) => (
												<Set
													index={index + 1}
													card={card}
													onChangeHandler={onChangeHandler}
													removeHandler={removeHandler}
													disabled={loading}
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													dragOver={snapshot.draggingOver}
												/>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</Stack>
							)}
						</Droppable>
					</DragDropContext>
				)}
				<Button
					type='button'
					variant='contained'
					endIcon={<AddBoxIcon />}
					onClick={addCardHandler}
					disabled={loading}
				>
					Add
				</Button>
			</Stack>
			<SettingModal
				openSettingModal={openSettingModal}
				closeSettingHandler={closeSettingHandler}
				privacy={privacy}
				tags={tags}
				tag={tag}
				addTagHandler={addTagHandler}
				removeTagHandler={removeTagHandler}
				privacyHandler={privacyHandler}
				tagChangeHandler={tagChangeHandler}
			/>
		</>
	);
};

export default CreatePage;
