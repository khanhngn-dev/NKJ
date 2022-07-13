import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/user.slice';
import notificationReducer from './notification/notification.slice';

export const store = configureStore({
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
	reducer: {
		user: userReducer,
		notification: notificationReducer,
	},
});
