import { combineReducers, configureStore } from '@reduxjs/toolkit';
import UserSlice from './UserSlice';

const rootReducer = combineReducers({
  User: UserSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
