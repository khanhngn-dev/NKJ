import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearNotification } from './notification.slice';

export const setNotificationAsync = createAsyncThunk(
	'notification/setNotificationAsync',
	(notification, thunkAPI) => {
		thunkAPI.dispatch(clearNotification());
		return notification;
	}
);
