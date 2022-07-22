import { Button, Divider, Stack, TextField } from '@mui/material';

const Comments = ({ set, content, commentHandler, submitHandler }) => {
	const { title, comment } = content;

	return (
		<Stack
			direction='column'
			justifyContent='center'
			alignItems='center'
			gap={4}
			sx={{
				width: '90%',
			}}
		>
			<Divider flexItem>Leave a comment</Divider>
			<form
				onSubmit={submitHandler}
				style={{
					width: '100%',
				}}
			>
				<Stack
					direction='column'
					justifyContent='center'
					alignItems='center'
					sx={{ width: '100%' }}
					gap={4}
				>
					<TextField
						label='Title'
						value={title}
						onChange={commentHandler}
						fullWidth
						size='small'
						name='title'
					></TextField>
					<TextField
						label='Comment'
						placeholder='Tell us what you think about this set...'
						multiline
						rows={3}
						fullWidth
						value={comment}
						onChange={commentHandler}
						size='small'
						sx={{ resize: 'vertical' }}
						name='comment'
					></TextField>

					<Button sx={{ alignSelf: 'flex-end' }} type='submit' variant='contained'>
						Comment
					</Button>
				</Stack>
			</form>
		</Stack>
	);
};

export default Comments;
