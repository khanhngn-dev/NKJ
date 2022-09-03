import { Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
// import { ReactComponent as LandingPageSVG } from '../../assets/Landing.svg';
import {
	LandingPageImageContainer,
	LandingPageImage,
	LandingButton,
	DecorBar,
} from './HomePage.styles';

import { LEARNING_NAV_LINK } from '../../components/Navigation/Navigation.component';
import ROUTE from '../../routers/Routes';

const HomePage = () => {
	const currentUser = useSelector((state) => state.user.currentUser);
	const navigate = useNavigate();
	return (
		<Stack
			justifyContent='space-between'
			gap={2}
			alignItems='center'
			sx={{
				maxWidth: '1024px',
				margin: 'auto',
				padding: '60px',
				flexFlow: { xs: 'column', sm: 'row' },
			}}
		>
			<Stack
				gap={5}
				sx={{
					width: { xs: '100%', sm: '25%' },
					height: { sm: '50vw' },
					maxHeight: { sm: '600px' },
					flexDirection: { xs: 'row', sm: 'column' },
					flexWrap: 'wrap',
				}}
				justifyContent={currentUser ? 'center' : 'flex-end'}
			>
				{currentUser ? (
					<>
						{LEARNING_NAV_LINK.map((link, i) => (
							<LandingButton
								key={i}
								variant='contained'
								onClick={() => navigate(`/${link.toLowerCase()}`)}
							>
								{link}
							</LandingButton>
						))}
					</>
				) : (
					<LandingButton
						variant='contained'
						sx={{ marginBottom: '80px' }}
						onClick={() => navigate(ROUTE.SIGNUP)}
					>
						Get Started
					</LandingButton>
				)}
			</Stack>
			<LandingPageImageContainer>
				<DecorBar height='10px' width='120px' top='80px' left='20px' />
				<DecorBar height='10px' width='150px' top='40px' right='60px' />
				<LandingPageImage src='../../assets/landing.png' alt='Landing Page' />
			</LandingPageImageContainer>
		</Stack>
	);
};

export default HomePage;
