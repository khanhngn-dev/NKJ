import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/user.slice';

export const store = configureStore({
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['user/updateCurrentUser'],
			},
		}),
	reducer: {
		user: userReducer,
	},
});
