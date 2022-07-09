import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { Stack, TextField, Button, Modal, Typography, Link, Switch } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SettingsIcon from '@mui/icons-material/Settings';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/material/styles';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Toastr from '../../components/Toastr/Toastr.component';
import Set from '../../components/Set/Set.component';
import { SpinnerContainer } from '../../components/Spinner/Spinner.styles';

import { v1 as uuidv1 } from 'uuid';

const defaultNotification = {
	message: '',
	state: '',
};

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const MaterialUISwitch = styled(Switch)(() => ({
	width: 62,
	height: 34,
	padding: 7,
	'& .MuiSwitch-switchBase': {
		margin: 1,
		padding: 0,
		transform: 'translateX(6px)',
		'&.Mui-checked': {
			color: '#fff',
			transform: 'translateX(22px)',
			'& .MuiSwitch-thumb:before': {
				backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 25 25"><path fill="${encodeURIComponent(
					'#fff'
				)}" d="M 12 2 C 6.48 2 2 6.48 2 12 s 4.48 10 10 10 s 10 -4.48 10 -10 S 17.52 2 12 2 Z m -1 17.93 c -3.95 -0.49 -7 -3.85 -7 -7.93 c 0 -0.62 0.08 -1.21 0.21 -1.79 L 9 15 v 1 c 0 1.1 0.9 2 2 2 v 1.93 Z m 6.9 -2.54 c -0.26 -0.81 -1 -1.39 -1.9 -1.39 h -1 v -3 c 0 -0.55 -0.45 -1 -1 -1 H 8 v -2 h 2 c 0.55 0 1 -0.45 1 -1 V 7 h 2 c 1.1 0 2 -0.9 2 -2 v -0.41 c 2.93 1.19 5 4.06 5 7.41 c 0 2.08 -0.8 3.97 -2.1 5.39 Z"/></svg>')`,
			},
			'& + .MuiSwitch-track': {
				opacity: 1,
				backgroundColor: '#8796A5',
			},
		},
	},
	'& .MuiSwitch-thumb': {
		backgroundColor: '#C00734',
		width: 32,
		height: 32,
		'&:before': {
			content: "''",
			position: 'absolute',
			width: '100%',
			height: '100%',
			left: 0,
			top: 0,
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center',
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 25 25"><path fill="${encodeURIComponent(
				'#fff'
			)}" d="M 18 8 h -1 V 6 c 0 -2.76 -2.24 -5 -5 -5 S 7 3.24 7 6 v 2 H 6 c -1.1 0 -2 0.9 -2 2 v 10 c 0 1.1 0.9 2 2 2 h 12 c 1.1 0 2 -0.9 2 -2 V 10 c 0 -1.1 -0.9 -2 -2 -2 Z m -6 9 c -1.1 0 -2 -0.9 -2 -2 s 0.9 -2 2 -2 s 2 0.9 2 2 s -0.9 2 -2 2 Z m 3.1 -9 H 8.9 V 6 c 0 -1.71 1.39 -3.1 3.1 -3.1 c 1.71 0 3.1 1.39 3.1 3.1 v 2 Z"/></svg>')`,
		},
	},
	'& .MuiSwitch-track': {
		opacity: 1,
		backgroundColor: '#8796A5',
		borderRadius: 20 / 2,
	},
}));

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
		<form
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
			<Stack direction='column' spacing={2} alignItems='center' justifyContent='center'>
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
		</form>
	</Modal>
);

const CreatePage = () => {
	const navigate = useNavigate();
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(false);
	const [notification, setNotification] = useState(defaultNotification);
	const [openSettingModal, setOpenSettingModal] = useState(false);
	const [tag, setTag] = useState('');
	const [tags, setTags] = useState([]);
	const [privacy, setPrivacy] = useState(false);

	const currentUser = useSelector((state) => state.user.currentUser);

	const removeNotification = () => setNotification(defaultNotification);

	const onSubmitHandler = (e) => {
		e.preventDefault();
		if (cards.length === 0) {
			setNotification({ message: 'The set is empty', state: 'warning' });
		} else if (cards.every((card) => card.term && card.meaning)) {
			// Send to firebase
			try {
				setLoading(true);
				setNotification({ message: 'Creating set...', state: 'info' });
				// Await Send to firebase
				setLoading(false);
				setNotification({ message: 'Set created successfully', state: 'success' });
			} catch (e) {
				setLoading(false);
				setNotification({ message: e.message, state: 'error' });
			}
		} else {
			setNotification({ message: 'All terms and meanings must be filled in', state: 'warning' });
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
		setNotification({ message: 'Card delete successfully', state: 'success' });
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
			setNotification({
				message: 'Cannot set empty tag',
				state: 'warning',
			});
			return;
		}
		const addedTag = tag.toUpperCase();
		if (!tags.every((tag) => tag !== addedTag)) {
			setNotification({
				message: 'Tag already exists',
				state: 'warning',
			});
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
						<TextField required label='Title' variant='standard'></TextField>
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
			<Modal open={!currentUser}>
				<div
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						outline: 'none',
						textAlign: 'center',
						background: 'white',
						padding: '20px',
						borderRadius: '20px',
					}}
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
				</div>
			</Modal>
			{notification.message && (
				<Toastr severity={notification.state} timeToLive={5} removeHandler={removeNotification}>
					{notification.message}
				</Toastr>
			)}
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
