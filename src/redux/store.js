import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/user.slice';

export const store = configureStore({
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
	reducer: {
		user: userReducer,
	},
});
