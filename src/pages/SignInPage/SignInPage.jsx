import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Stack, Typography, Link, TextField, Button } from '@mui/material';

const initialFormField = {
	email: '',
	password: '',
};

const SignInPage = () => {
	const navigate = useNavigate();
	const [formField, setFormField] = useState(initialFormField);
	const { email, password } = formField;

	const onChangeHandler = (e) => {
		const { name, value } = e.target;
		setFormField({ ...formField, [name]: value });
	};

	const resetFormHandler = () => {
		setFormField(initialFormField);
	};

	return (
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
						Sign in
					</Typography>
					<Typography variant='h5'>
						Don't have an account?{' '}
						<Link
							variant='h5'
							component='span'
							underline='hover'
							color='primary'
							sx={{ cursor: 'pointer' }}
							onClick={() => navigate('/signup')}
						>
							Sign Up
						</Link>
					</Typography>
				</Stack>
				<form>
					<Stack direction='column' spacing={4} alignItems='center' justifyContent='center'>
						<TextField
							label='Username'
							variant='outlined'
							name='email'
							value={email}
							required
							type='email'
							onChange={onChangeHandler}
							fullWidth
						></TextField>
						<TextField
							label='Password'
							variant='outlined'
							name='password'
							value={password}
							required
							type='password'
							onChange={onChangeHandler}
							fullWidth
						></TextField>
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
					</Stack>
				</form>
			</Stack>
		</div>
	);
};

export default SignInPage;
