import { forwardRef } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Set = forwardRef(
	({ card, onChangeHandler, removeHandler, disabled, dragOver, index, ...others }, ref) => {
		return (
			<Grid
				container
				sx={{
					margin: '10px 0',
					padding: '20px',
					gap: '10px',
					width: '90%',
					borderRadius: '10px',
					border: '4px solid',
					borderColor: dragOver ? '#ffb8b1' : '#fff',
					backgroundColor: dragOver ? '#fee' : '#fff',
				}}
				ref={ref}
				{...others}
			>
				<Grid item xs={12}>
					<span style={{ fontWeight: 700, padding: '0 10px' }}>No. {index}</span>
				</Grid>
				<Grid
					item
					sx={{
						flex: 11,
						display: 'flex',
						flexFlow: 'column',
						gap: '10px',
						justifyContent: 'center',
					}}
				>
					<TextField
						fullWidth
						label='Term'
						variant='filled'
						name='term'
						value={card.term}
						onChange={(e) => onChangeHandler(e, card.id)}
						disabled={disabled}
					></TextField>
					<TextField
						fullWidth
						label='Meaning'
						variant='filled'
						name='meaning'
						value={card.meaning}
						onChange={(e) => onChangeHandler(e, card.id)}
						disabled={disabled}
					></TextField>
				</Grid>
				<Button sx={{ flex: 1 }} onClick={() => removeHandler(card.id)} disabled={disabled}>
					<DeleteIcon />
				</Button>
			</Grid>
		);
	}
);

export default Set;
