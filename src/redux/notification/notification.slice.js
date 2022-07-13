import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	message: '',
	severity: '',
};

const notificationSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		setCurrentNotification: (state, action) => {
			const { message, severity } = action.payload;
			state.message = message;
			state.severity = severity;
		},
	},
});

export const { setCurrentNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
