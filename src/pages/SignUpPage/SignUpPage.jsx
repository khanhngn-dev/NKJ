import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
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
import Toastr from '../../components/Toastr/Toastr.component';

const defaultFormField = {
	email: '',
	password: '',
	confirmPassword: '',
};

const defaultErrorEmail = {
	message: '',
};
const defaultErrorPwd = {
	message: '',
};
const defaultNoti = {
	message: '',
	state: '',
};

const SignUpPage = () => {
	const navigate = useNavigate();
	const [formField, setFormField] = useState(defaultFormField);
	const [emailError, setEmailError] = useState(defaultErrorEmail);
	const [pwdError, setPwdError] = useState(defaultErrorPwd);
	const [signUpNoti, setSignUpNoti] = useState(defaultNoti);
	const { email, password, confirmPassword } = formField;

	const onChangeHandler = (e) => {
		const { name, value } = e.target;
		setFormField({ ...formField, [name]: value });
	};

	const resetFormHandler = () => {
		setFormField(defaultFormField);
	};

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		if (emailError.message || pwdError.message) {
			return;
		}
		try {
			await createUserUsingEmailPassword(email, password);
			setSignUpNoti({ message: 'Sign up successfully', state: 'success' });
		} catch (e) {
			setEmailError({
				message: e?.code?.split('/')[1].replace(/-/g, ' ').toUpperCase(),
			});
		}
		// resetFormHandler();
	};

	const handlePopupSignUp = async (popUp) => {
		try {
			await popUp();
		} catch (e) {
			if (e.code === 'auth/account-exists-with-different-credential') {
				setSignUpNoti({
					message: 'Account already exist with different credentials',
					state: 'error',
				});
			}
		}
	};

	useEffect(() => {
		if (password.length < 6 && password !== '') {
			setPwdError({ message: 'Password needs to be at least 6 characters' });
		} else if (password !== confirmPassword) {
			setPwdError({
				message: 'Password does not match',
			});
		} else {
			setPwdError({ message: '' });
		}
	}, [password, confirmPassword]);

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
							Sign up
						</Typography>
						<Typography variant='h5'>
							Already have an account?{' '}
							<Link
								variant='h5'
								color='primary'
								component='span'
								underline='hover'
								sx={{ cursor: 'pointer' }}
								onClick={() => navigate('/signin')}
							>
								Sign In
							</Link>
						</Typography>
					</Stack>
					<form onSubmit={onSubmitHandler}>
						<Stack direction='column' spacing={4} alignItems='center' justifyContent='center'>
							<TextField
								label='Username'
								variant='outlined'
								name='email'
								value={email}
								required
								type='email'
								onChange={(e) => {
									setEmailError({ message: '' });
									onChangeHandler(e);
								}}
								fullWidth
								helperText={emailError.message}
								error={emailError.message.length !== 0}
							></TextField>
							<TextField
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
								error={pwdError.message}
							></TextField>
							<TextField
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
										type='submit'
										variant='contained'
										sx={{
											flex: 3,
											fontWeight: 700,
										}}
									>
										Sign up
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
										type='button'
										color='primary'
										variant='contained'
										sx={{ flex: 1 }}
										onClick={() => handlePopupSignUp(signInUsingGooglePopUp)}
									>
										<GoogleIcon />
									</Button>
									<Button
										type='button'
										color='primary'
										variant='contained'
										sx={{ flex: 1 }}
										onClick={() => handlePopupSignUp(signInUsingFacebookPopUp)}
									>
										<FacebookIcon />
									</Button>
									<Button
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
			{signUpNoti.message && (
				<Toastr severity={signUpNoti.state} timeToLive={5}>
					{signUpNoti.message}
				</Toastr>
			)}
		</>
	);
};

export default SignUpPage;
