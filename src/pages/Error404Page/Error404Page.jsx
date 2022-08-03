import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Stack, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router';
import ROUTE from '../../routers/Routes';

const Error404Page = () => {
	const navigate = useNavigate();
	return (
		<Stack
			direction='column'
			justifyContent='center'
			alignItems='center'
			spacing={5}
			style={{
				width: '100%',
			}}
		>
			<Typography color='primary'>
				<QuestionMarkIcon sx={{ fontSize: '6rem' }} />
			</Typography>
			<Typography variant='h4' color='primary'>
				Error 404
			</Typography>
			<Stack direction='column' alignItems='center' justifyContent='center' spacing={2}>
				<Typography variant='h6' color='primary'>
					We cannot find {`${window.location.href}`}
				</Typography>
				<Typography variant='h6' color='primary'>
					Check for typo in the URL or return{' '}
					<Link
						underline='hover'
						sx={{
							cursor: 'pointer',
              fontWeight: 'bold',
						}}
						onClick={() => navigate(ROUTE.HOMEPAGE)}
					>
						Home
					</Link>
				</Typography>
			</Stack>
		</Stack>
	);
};

export default Error404Page;
