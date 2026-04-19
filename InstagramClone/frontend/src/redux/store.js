import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import postReducer from './postSlice.js';
import chatReducer from './chatSlice.js';
import socketReducer from './socketSlice.js';
import realTimeNotiReducer from './realTimeNotiSlice.js';

// persisting the redux store
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
	key: 'root',
	version: 1,
	storage,
};

// actual slices:
const rootReducer = combineReducers({
	auth: authReducer,
	post: postReducer,
	chat: chatReducer,
	socketio: socketReducer,
	realTimeNotification: realTimeNotiReducer,
});

// persisting the redux store
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export default store;
