import { generatePath, useNavigate } from 'react-router';
import { Avatar, Card, CardContent, CardHeader, IconButton, Typography } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import { timeConverter } from '../../utils/date/date';
import ROUTE from '../../routers/Routes';

const CommentCard = ({ content }) => {
	const navigate = useNavigate();
	const { title, comment, user, created, uid } = content;
	const time = timeConverter(created);

	const navigateHandler = () => {
		navigate(
			generatePath(ROUTE.PROFILE_ID, {
				uid,
			})
		);
	};

	return (
		<Card sx={{ width: '100%' }}>
			<CardHeader
				avatar={
					<Avatar
						sx={{ bgcolor: 'var(--primary-color)', cursor: 'pointer' }}
						onClick={navigateHandler}
					>
						{user.split(' ').map((string) => string.charAt(0))}
					</Avatar>
				}
				title={
					<Typography
						color='primary'
						variant='body1'
						onClick={navigateHandler}
						sx={{ fontWeight: 700, cursor: 'pointer' }}
					>
						{user}
					</Typography>
				}
				subheader={time}
				action={
					<IconButton color='primary'>
						<ReportIcon />
					</IconButton>
				}
			/>
			<CardContent>
				<Typography variant='h6' color='primary'>
					{title}
				</Typography>
				<Typography variant='body1'>{comment}</Typography>
			</CardContent>
		</Card>
	);
};

export default CommentCard;
