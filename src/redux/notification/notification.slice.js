import { createSlice } from '@reduxjs/toolkit';
import { setNotificationAsync } from './notification.action';

const initialState = {
	message: '',
	severity: '',
};

const notificationSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		clearNotification: (state, action) => {
			state.message = '';
			state.severity = '';
		},
	},
	extraReducers: (builder) => {
		builder.addCase(setNotificationAsync.fulfilled, (state, action) => {
			const { message, severity } = action.payload;
			state.message = message;
			state.severity = severity;
		});
	},
});

export const { clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
