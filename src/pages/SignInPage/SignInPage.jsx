import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TextField, Stack, Typography, Link, Button, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import {
	signInUsingEmailPassword,
	signInUsingFacebookPopUp,
	signInUsingGooglePopUp,
	signInUsingGithubPopup,
} from '../../utils/firebase/firebase.utils';
import Toastr from '../../components/Toastr/Toastr.component';
import { SpinnerContainer } from '../../components/Spinner/Spinner.styles';

const defaultFormField = {
	email: '',
	password: '',
};

const defaultNotification = {
	message: '',
	state: '',
};

const SignInPage = () => {
	const navigate = useNavigate();
	const [formField, setFormField] = useState(defaultFormField);
	const [emailError, setEmailError] = useState(false);
	const [pwdError, setPwdError] = useState(false);
	const [notification, setNotification] = useState(defaultNotification);
	const [loading, setLoading] = useState(false);
	const { email, password } = formField;

	const removeNotification = () => setNotification(defaultNotification);

	const onChangeHandler = (e) => {
		const { name, value } = e.target;
		setFormField({ ...formField, [name]: value });
	};

	const resetFormHandler = () => {
		setFormField(defaultFormField);
		setEmailError(false);
		setPwdError(false);
	};

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		if (emailError || pwdError) {
			return;
		}
		try {
			setLoading(true);
			await signInUsingEmailPassword(email, password);
			setNotification({ message: 'Sign in successfully', state: 'success' });
			setLoading(false);
		} catch (e) {
			setLoading(false);
			setNotification({
				message: e?.code?.split('/')[1].replace(/-/g, ' ').toUpperCase(),
				state: 'error',
			});
			if (e.code === 'auth/wrong-password') {
				setPwdError(true);
			} else if (e.code === 'auth/user-not-found') {
				setEmailError(true);
			}
		}
	};

	const handlePopupSignUp = async (popUp) => {
		try {
			setLoading(true);
			await popUp();
			setNotification({ message: 'Sign in successfully', state: 'success' });
			setLoading(false);
		} catch (e) {
			setLoading(false);
			if (e.code === 'auth/account-exists-with-different-credential') {
				setNotification({
					message: 'Account already exist with different credentials',
					state: 'error',
				});
			}
		}
	};

	return (
		<>
			<div
				style={{
					width: '100%',
					height: 'calc(100vh - 120px)',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Stack direction='column' spacing={4} justifyContent='center' sx={{ width: '50vw' }}>
					<Stack direction='column' spacing={1}>
						<Typography variant='h4' color='primary'>
							Sign In
						</Typography>
						<Typography variant='h5'>
							Don't have an account?{' '}
							<Link
								variant='h5'
								color='primary'
								component='span'
								underline='hover'
								sx={{ cursor: 'pointer' }}
								onClick={() => navigate('/signup')}
							>
								Sign Up
							</Link>
						</Typography>
					</Stack>
					<form onSubmit={onSubmitHandler}>
						<Stack direction='column' spacing={4} alignItems='center' justifyContent='center'>
							<TextField
								disabled={loading}
								label='Username'
								variant='outlined'
								name='email'
								value={email}
								required
								type='email'
								onChange={(e) => {
									setEmailError(false);
									onChangeHandler(e);
								}}
								fullWidth
								error={emailError}
							></TextField>
							<TextField
								disabled={loading}
								label='Password'
								variant='outlined'
								name='password'
								value={password}
								required
								type='password'
								onChange={(e) => {
									setPwdError(false);
									onChangeHandler(e);
								}}
								fullWidth
								error={pwdError}
							></TextField>
							<Stack
								direction='column'
								divider={<Divider variant='middle'>OR SIGN IN USING</Divider>}
								sx={{ width: '100%' }}
								spacing={2}
							>
								<Stack direction='row' spacing={2} sx={{ width: '100%', height: '50px' }}>
									<Button
										disabled={loading}
										type='reset'
										variant='outlined'
										sx={{
											flex: 1,
											fontWeight: 700,
										}}
										onClick={resetFormHandler}
									>
										Reset
									</Button>
									<Button
										disabled={pwdError || emailError || loading}
										type='submit'
										variant='contained'
										sx={{
											flex: 3,
											fontWeight: 700,
										}}
									>
										{loading ? (
											<SpinnerContainer
												style={{
													width: '30px',
													height: '30px',
												}}
											/>
										) : (
											'Sign in'
										)}
									</Button>
								</Stack>
								<Stack
									direction='row'
									spacing={2}
									sx={{ width: '100%', height: '50px' }}
									alignItems='center'
									justifyContent='center'
								>
									<Button
										disabled={loading}
										type='button'
										color='primary'
										variant='contained'
										sx={{ flex: 1 }}
										onClick={() => handlePopupSignUp(signInUsingGooglePopUp)}
									>
										<GoogleIcon />
									</Button>
									<Button
										disabled={loading}
										type='button'
										color='primary'
										variant='contained'
										sx={{ flex: 1 }}
										onClick={() => handlePopupSignUp(signInUsingFacebookPopUp)}
									>
										<FacebookIcon />
									</Button>
									<Button
										disabled={loading}
										type='button'
										color='primary'
										variant='contained'
										sx={{ flex: 1 }}
										onClick={() => handlePopupSignUp(signInUsingGithubPopup)}
									>
										<GitHubIcon />
									</Button>
								</Stack>
							</Stack>
						</Stack>
					</form>
				</Stack>
			</div>
			{notification.message && (
				<Toastr severity={notification.state} timeToLive={5} removeHandler={removeNotification}>
					{notification.message}
				</Toastr>
			)}
		</>
	);
};

export default SignInPage;
