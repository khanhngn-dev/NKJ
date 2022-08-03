import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setNotificationAsync } from '../../redux/notification/notification.action';

import { TextField, Stack, Typography, Link, Button, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import {
	createUserUsingEmailPassword,
	signInUsingFacebookPopUp,
	signInUsingGooglePopUp,
	signInUsingGithubPopup,
} from '../../utils/firebase/firebase.utils';

import { SpinnerContainer } from '../../components/Spinner/Spinner.styles';
import ROUTE from '../../routers/Routes';

const defaultFormField = {
	email: '',
	password: '',
	confirmPassword: '',
};

const defaultError = {
	message: '',
};

const SignUpPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [formField, setFormField] = useState(defaultFormField);
	const [emailError, setEmailError] = useState(false);
	const [pwdError, setPwdError] = useState(defaultError);
	const [loading, setLoading] = useState(false);
	const { email, password, confirmPassword } = formField;

	const onChangeHandler = (e) => {
		const { name, value } = e.target;
		setFormField({ ...formField, [name]: value });
	};

	const resetFormHandler = () => {
		setFormField(defaultFormField);
		setEmailError(false);
		setPwdError(defaultError);
	};

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		if (emailError || pwdError.message) {
			return;
		}
		try {
			setLoading(true);
			await createUserUsingEmailPassword(email, password);
			dispatch(setNotificationAsync({ message: 'Sign up successfully', severity: 'success' }));
			setLoading(false);
		} catch (e) {
			setLoading(false);
			dispatch(
				setNotificationAsync({
					message: e?.code?.split('/')[1].replace(/-/g, ' ').toUpperCase(),
					severity: 'error',
				})
			);
			setEmailError(true);
		}
	};

	const handlePopupSignUp = async (popUp) => {
		try {
			setLoading(true);
			await popUp();
			dispatch(setNotificationAsync({ message: 'Sign up successfully', severity: 'success' }));
			setLoading(false);
		} catch (e) {
			setLoading(false);
			if (e.code === 'auth/account-exists-with-different-credential') {
				dispatch(
					setNotificationAsync({
						message: 'Account already exist with different credentials',
						severity: 'error',
					})
				);
			}
		}
	};

	useEffect(() => {
		if (password.length < 6 && password !== '') {
			setPwdError({ message: 'Password needs to be at least 6 characters' });
		} else if (password !== confirmPassword) {
			setPwdError({
				message: 'Confirm password does not match',
			});
		} else {
			setPwdError({ message: '' });
		}
	}, [password, confirmPassword]);

	return (
		<>
			<div
				style={{
					paddingTop: '80px',
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Stack direction='column' spacing={4} justifyContent='center' sx={{ width: '50vw' }}>
					<Stack direction='column' spacing={1}>
						<Typography variant='h4' color='primary'>
							Sign Up
						</Typography>
						<Typography variant='h5'>
							Already have an account?{' '}
							<Link
								variant='h5'
								color='primary'
								component='span'
								underline='hover'
								sx={{ cursor: 'pointer' }}
								onClick={() => navigate(ROUTE.SIGNIN)}
							>
								Sign In
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
									onChangeHandler(e);
								}}
								fullWidth
								error={pwdError.message.length !== 0}
							></TextField>
							<TextField
								disabled={loading}
								label='Confirm Password'
								variant='outlined'
								name='confirmPassword'
								value={confirmPassword}
								required
								type='password'
								onChange={(e) => {
									onChangeHandler(e);
								}}
								fullWidth
								helperText={pwdError.message}
								error={pwdError.message.length !== 0}
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
										disabled={pwdError.message.length !== 0 || emailError || loading}
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
											'Sign up'
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
		</>
	);
};

export default SignUpPage;
