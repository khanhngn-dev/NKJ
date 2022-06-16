import { Stack, TextField, Button, Card } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Set = ({ index, card, onChangeHandler, removeHandler, disabled }) => {
	return (
		<Card sx={{ display: 'flex', flexFlow: 'row', padding: '20px', gap: '10px', width: '100%' }}>
			<Stack spacing={2} sx={{ flex: 1 }}>
				<TextField
					fullWidth
					label='Term'
					variant='filled'
					name='term'
					value={card.term}
					onChange={(e) => onChangeHandler(e, index)}
					disabled={disabled}
				></TextField>
				<TextField
					fullWidth
					label='Meaning'
					variant='filled'
					name='meaning'
					value={card.meaning}
					onChange={(e) => onChangeHandler(e, index)}
					disabled={disabled}
				></TextField>
			</Stack>
			<Button onClick={() => removeHandler(index)} disabled={disabled}>
				<DeleteIcon />
			</Button>
		</Card>
	);
};

export default Set;
