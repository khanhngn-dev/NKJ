import { useState, useRef, useEffect } from 'react';
import { useNavigate, generatePath } from 'react-router';
import { Card, Typography, Button, Stack, Skeleton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { timeConverter } from '../../utils/date/date';

const MAX_TAG_LENGTH = window.innerWidth / 3.5;

export const SkeletonSummary = ({ editable }) => (
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
			<div style={{ width: '100%' }}>
				<Typography variant='h6' color='primary' sx={{ cursor: 'pointer' }}>
					<Skeleton />
				</Typography>
				<Typography variant='body1'>
					<Skeleton />
				</Typography>
				<Stack direction='row' flexWrap='wrap' alignItems='center' sx={{ gap: '5px' }}>
					{[...new Array(6)].map((_, index) => (
						<Skeleton
							key={index}
							variant='rectangular'
							width={50}
							height={30}
							sx={{ margin: '5px 0', marginLeft: 0, minWidth: '50px', flex: 1 }}
						/>
					))}
				</Stack>
				<Typography variant='body1'>
					<Skeleton />
				</Typography>
				<Typography variant='body1' color='primary'>
					<Skeleton />
				</Typography>
			</div>
			{editable && (
				<Stack
					direction='column'
					justifyContent='center'
					alignItems='center'
					sx={{ alignSelf: 'center' }}
					spacing={2}
				>
					<Button variant='contained'>
						<EditIcon />
					</Button>
					<Button variant='contained'>
						<DeleteIcon />
					</Button>
				</Stack>
			)}
		</Stack>
	</Card>
);

const SetSummary = ({ set, deleteSetHandler, editable, edit }) => {
	const tagsRef = useRef();
	const navigate = useNavigate();
	const { id, title, tags, content, created } = set;
	const time = timeConverter(created);
	const [maxTags, setMaxTags] = useState(tags.length || 0);

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
				sx={{ width: '100%', height: '100%', flex: 1 }}
				spacing={2}
			>
				<div>
					<Typography
						variant='h6'
						color='primary'
						sx={{ cursor: 'pointer' }}
						onClick={() => {
							navigate(
								generatePath('/set/:privacy/:id', {
									id,
									privacy: Number(set.privacy),
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
					<Typography variant='body1' color='primary'>
						Created on: {time}
					</Typography>
				</div>
				{editable && (
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
				)}
			</Stack>
		</Card>
	);
};

export default SetSummary;
