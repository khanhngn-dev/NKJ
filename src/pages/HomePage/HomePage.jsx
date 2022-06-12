import { Stack, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
// import { ReactComponent as LandingPageSVG } from '../../assets/Landing.svg';
import {
	LandingPageImageContainer,
	LandingPageImage,
	LandingButton,
	DecorBar,
} from './HomePage.styles';

const HomePage = () => {
	const currentUser = useSelector((state) => state.user.currentUser);
	const navigate = useNavigate();
	return (
		<Stack
			direction='row'
			justifyContent='space-between'
			spacing={2}
			alignItems='center'
			sx={{ maxWidth: '1024px', margin: 'auto', padding: '60px', height: 'calc(100vh - 120px)' }}
		>
			<Stack
				direction='column'
				spacing={5}
				sx={{ width: '25%', height: '50vw', maxHeight: '600px' }}
				justifyContent={currentUser ? 'center' : 'flex-end'}
			>
				{currentUser ? (
					<>
						<LandingButton variant='contained' onClick={() => navigate('/alphabet')}>
							Alphabet
						</LandingButton>
						<LandingButton variant='contained' onClick={() => navigate('/grammar')}>
							Grammar
						</LandingButton>
						<LandingButton variant='contained' onClick={() => navigate('/vocabulary')}>
							Vocabulary
						</LandingButton>
						<LandingButton variant='contained' onClick={() => navigate('/exercise')}>
							Exercise
						</LandingButton>
					</>
				) : (
					<LandingButton variant='contained' sx={{ marginBottom: '80px' }}>
						Get Started
					</LandingButton>
				)}
			</Stack>
			<LandingPageImageContainer>
				<DecorBar height='10px' width='120px' top='80px' left='20px' />
				<DecorBar height='10px' width='150px' top='40px' right='60px' />
				<LandingPageImage src='../../assets/Landing.png' alt='Landing Page' />
			</LandingPageImageContainer>
		</Stack>
	);
};

export default HomePage;
