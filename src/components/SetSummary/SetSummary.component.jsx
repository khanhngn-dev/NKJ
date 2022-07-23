import { useState, useRef, useEffect } from 'react';
import { useNavigate, generatePath } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Button, Stack, Skeleton, Rating } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { timeConverter } from '../../utils/date/date';
import { updateLearningSet } from '../../utils/firebase/firebase.utils';
import { setNotificationAsync } from '../../redux/notification/notification.action';
import ROUTE from '../../routers/Routes';

export const SkeletonSummary = ({ editable }) => (
	<Card
		sx={{
			padding: '20px',
			boxShadow: 2,
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
				<Typography variant='h5' color='primary' sx={{ cursor: 'pointer' }}>
					<Skeleton />
				</Typography>
				<Typography variant='body1' color='primary'>
					<Skeleton />
				</Typography>
				<Typography variant='body1'>
					<Skeleton />
				</Typography>
				<Stack direction='row' flexWrap='wrap' alignItems='center' sx={{ gap: '5px' }}>
					{[...new Array(3)].map((_, index) => (
						<Skeleton
							key={index}
							variant='rectangular'
							width={50}
							height={36.5}
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
				<Rating disabled size='large' />
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

const MAX_TAG_LENGTH = window.innerWidth < 1024 ? window.innerWidth / 1.5 : window.innerWidth / 3.5;

const SetSummary = ({ set, deleteSetHandler, editable }) => {
	const currentUser = useSelector((state) => state.user.currentUser);
	const tagsRef = useRef();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id, title, tags, content, updated, ratings, user, privacy } = set;
	const { uid, displayName } = user;
	const { avgStars, rated } = ratings;
	const time = timeConverter(updated);
	const [maxTags, setMaxTags] = useState(tags.length || 0);
	const [ratingStars, setRatingStars] = useState(rated[currentUser?.uid] || -1);

	const starClickHandler = async (index) => {
		try {
			const len = Object.keys(rated).length;
			const diff = rated[currentUser?.uid] || 0;
			const deno = diff === 0 ? len + 1 : len;
			const avg = (avgStars * len - diff + index) / deno;
			updateLearningSet(id, uid, {
				privacy,
				ratings: {
					avgStars: avg,
					rated: { ...rated, [currentUser.uid]: index },
				},
			});
			setRatingStars(index);
			dispatch(
				setNotificationAsync({
					message: 'Updated ratings',
					severity: 'success',
				})
			);
		} catch (e) {
			dispatch(
				setNotificationAsync({
					message: 'Failed to update ratings',
					severity: 'error',
				})
			);
		}
	};

	useEffect(() => {
		if (tagsRef?.current?.clientWidth > MAX_TAG_LENGTH) setMaxTags(maxTags - 1);
	}, [maxTags]);

	return (
		<Card
			sx={{
				padding: '20px',
				boxShadow: 2,
				transition: 'all .25s ease-in-out',
				'&:hover': {
					transform: 'scale(1.05)',
				},
			}}
		>
			<Stack
				justifyContent='space-between'
				alignItems='flex-start'
				sx={{ width: '100%', height: '100%', flex: 1, flexFlow: { xs: 'column', sm: 'row' } }}
				gap={2}
			>
				<div>
					<Typography
						variant='h5'
						color='primary'
						sx={{ cursor: 'pointer' }}
						onClick={() => {
							navigate(
								generatePath(ROUTE.SET_PRIVACY_ID, {
									id,
									privacy: Number(set.privacy),
								})
							);
						}}
					>
						{title}
					</Typography>
					<Typography
						variant='body1'
						sx={{ cursor: 'pointer' }}
						onClick={() =>
							navigate(
								generatePath(ROUTE.PROFILE_ID, {
									uid,
								})
							)
						}
					>
						By: <span style={{ color: 'var(--primary-color)' }}>{displayName}</span>
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
					<Typography variant='body1'>Number of items: {content.length}</Typography>
					<Typography variant='body1'>Updated on: {time}</Typography>

					<Stack direction='row' justifyContent='center' alignItems='center' gap={2}>
						<Rating
							name='ratings'
							value={editable ? avgStars : ratingStars}
							onChange={(event, newValue) => {
								starClickHandler(newValue);
							}}
							disabled={editable || !currentUser}
							precision={0.5}
							size='large'
						/>
						<Typography variant='h6' color='primary'>
							{avgStars < 0 ? 0 : avgStars.toFixed(1)}
						</Typography>
					</Stack>
				</div>
				{editable && (
					<Stack
						justifyContent='center'
						alignItems='center'
						sx={{
							alignSelf: 'center',
							flexFlow: {
								xs: 'row',
								sm: 'column',
							},
						}}
						gap={2}
					>
						<Button
							variant='contained'
							onClick={() => {
								navigate(
									generatePath(ROUTE.CREATE_ID, {
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
