import { Stack } from '@mui/material';
import CommentCard from '../CommentCard/CommentCard.component';

const CommentList = ({ comments }) => {
	const sorted = comments.sort((a, b) => b.created - a.created);
	return (
		<Stack
			direction='column'
			justifyContent='cetner'
			alignItems='center'
			gap={4}
			sx={{ width: '90%' }}
		>
			{/* <CommentCard></CommentCard> */}
			{sorted?.map((comment) => (
				<CommentCard key={comment.id} content={comment}></CommentCard>
			))}
		</Stack>
	);
};

export default CommentList;
