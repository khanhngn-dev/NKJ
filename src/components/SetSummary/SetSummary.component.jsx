import { useState, useRef, useEffect } from 'react';
import { useNavigate, generatePath } from 'react-router';
import { Card, Typography, Button, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { timeConverter } from '../../utils/date/date';

const MAX_TAG_LENGTH = window.innerWidth / 3.5;

const SetSummary = ({ set, deleteSetHandler }) => {
	const tagsRef = useRef();
	const navigate = useNavigate();
	const { id, title, tags, content, created } = set;
	const time = timeConverter(created);
	const [maxTags, setMaxTags] = useState(tags.length);

	useEffect(() => {
		if (tagsRef?.current?.clientWidth > MAX_TAG_LENGTH) setMaxTags(maxTags - 1);
	}, [maxTags]);

	return (
		<Card
			sx={{
				padding: '20px',
				height: '200px',
				boxShadow: 2,
				transition: 'all .25s ease-in-out',
				'&:hover': {
					transform: 'scale(1.05)',
				},
			}}
		>
			<Stack
				direction='row'
				justifyContent='space-between'
				alignItems='flex-start'
				sx={{ width: '100%', height: '100%' }}
				spacing={2}
			>
				<div>
					<Typography
						variant='h6'
						color='primary'
						sx={{ cursor: 'pointer' }}
						onClick={() => {
							navigate(
								generatePath('/set/:id', {
									id,
								})
							);
						}}
					>
						{title}
					</Typography>
					{tags.length !== 0 && (
						<div>
							<Typography variant='body1'>Tags: </Typography>
							<Stack
								ref={tagsRef}
								direction='row'
								flexWrap='nowrap'
								alignItems='center'
								sx={{ margin: '8px 0' }}
							>
								{tags.map(
									(tag, index) =>
										index < maxTags && (
											<Button
												variant='outlined'
												key={index}
												sx={{ marginRight: '10px', minWidth: 'min-content' }}
												size='medium'
											>
												{tag}
											</Button>
										)
								)}
								{tags.length - maxTags > 0 && (
									<Typography variant='body1' color='primary'>
										{tags.length - maxTags}+
									</Typography>
								)}
							</Stack>
						</div>
					)}
					<Typography variant='body1'>Total number of items: {content.length}</Typography>
					{time && (
						<Typography variant='body1' color='primary'>
							Created on: {time}
						</Typography>
					)}
				</div>
				<Stack
					direction='column'
					justifyContent='center'
					alignItems='center'
					sx={{ alignSelf: 'center' }}
					spacing={2}
				>
					<Button
						variant='contained'
						onClick={() => {
							navigate(
								generatePath('/create/:id', {
									id,
								})
							);
						}}
					>
						<EditIcon />
					</Button>
					<Button variant='contained' onClick={() => deleteSetHandler(id)}>
						<DeleteIcon />
					</Button>
				</Stack>
			</Stack>
		</Card>
	);
};

export default SetSummary;
