import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './user/user.slice';
import notificationReducer from './notification/notification.slice';

const persistConfig = {
	key: 'root',
	version: 1,
	storage,
	blackList: ['notification'],
};

const rootReducer = combineReducers({
	user: userReducer,
	notification: notificationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
	reducer: persistedReducer,
});

export const persistor = persistStore(store);
