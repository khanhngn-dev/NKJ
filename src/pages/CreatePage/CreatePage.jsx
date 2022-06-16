import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { Stack, TextField, Button, Modal } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Toastr from '../../components/Toastr/Toastr.component';
import Set from '../../components/Set/Set.component';
import { SpinnerContainer } from '../../components/Spinner/Spinner.styles';

const defaultNotification = {
	message: '',
	state: '',
};

const CreatePage = () => {
	const navigate = useNavigate();
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(false);
	const [notification, setNotification] = useState(defaultNotification);
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
				term: '',
				meaning: '',
			},
		]);
	};

	const onChangeHandler = (e, index) => {
		const cardToUpdate = cards[index];
		setCards(
			cards.map((card, i) =>
				index === i ? { ...cardToUpdate, [e.target.name]: e.target.value } : card
			)
		);
	};

	const removeHandler = (index) => {
		setCards(cards.filter((_, i) => i !== index));
		setNotification({ message: 'Card delete successfully', state: 'success' });
	};

	return (
		<>
			{currentUser ? (
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
							<Button
								type='submit'
								variant='contained'
								endIcon={!loading && <SendIcon />}
								disabled={loading}
								sx={{ height: '40px' }}
							>
								{loading ? <SpinnerContainer style={{ width: '30px', height: '30px' }} /> : 'Add'}
							</Button>
						</Stack>
					</form>
					<Stack
						direction='column'
						spacing={2}
						sx={{ width: '100%' }}
						justifyContent='center'
						alignItems='center'
					>
						{cards.map((card, index) => (
							<Set
								card={card}
								key={index}
								index={index}
								onChangeHandler={onChangeHandler}
								removeHandler={removeHandler}
								disabled={loading}
							/>
						))}
					</Stack>
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
			) : (
				<Modal open={!currentUser}>
					<div
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							outline: 'none',
						}}
					>
						<div>Become a user to use this feature</div>
						<div onClick={() => navigate('/signup')}>Sign Up</div>
						<div>Or if you already have an account</div>
						<div onClick={() => navigate('/signin')}>Sign In</div>
					</div>
				</Modal>
			)}
			{notification.message && (
				<Toastr severity={notification.state} timeToLive={5} removeHandler={removeNotification}>
					{notification.message}
				</Toastr>
			)}
		</>
	);
};

export default CreatePage;
