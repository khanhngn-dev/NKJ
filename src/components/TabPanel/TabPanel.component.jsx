import { Typography, Grid, Stack, Skeleton } from '@mui/material';
import Card from '../../components/Card/Card.component';

const TabPanel = ({ title, letters, loading }) => {
	return (
		<div
			role='tabpanel'
			// hidden={value !== index}
			// id={`tab-panel-${index}`}
			style={{ width: '100%' }}
		>
			<Typography sx={{ margin: '20px' }} variant='h4' textAlign='center'>
				{title}
			</Typography>
			{loading ? (
				<Grid container spacing={4}>
					{[...new Array(40)].map((_, index) => (
						<Grid item sm={3} xs={3} md={11 / 12} key={index}>
							<Skeleton height={80} />
						</Grid>
					))}
				</Grid>
			) : (
				<>
					{letters.length ? (
						<Grid container spacing={4}>
							{letters.map((letter, index) => (
								<Grid item sm={3} xs={3} md={11 / 12} key={index}>
									<Card>{letter.japanese}</Card>
								</Grid>
							))}
						</Grid>
					) : (
						<Stack justifyContent='center' alignItems='center'>
							<Typography variant='h5'>{title} alphabet is not currently supported</Typography>
							<Typography variant='h5'></Typography>
						</Stack>
					)}
				</>
			)}
		</div>
	);
};

export default TabPanel;
