import { Button, Typography } from '@mui/material';

const Card = ({ children }) => {
	return (
		<div>
			<Button variant='contained' sx={{ width: '100%', boxShadow:'none' }}>
				<Typography variant='body1' sx={{ fontSize: '2rem', fontWeight: 700 }}>
					{children}
				</Typography>
			</Button>
		</div>
	);
};

export default Card;
