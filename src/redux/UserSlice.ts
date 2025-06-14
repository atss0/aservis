import { createSlice } from '@reduxjs/toolkit';

export type UserState = {
  user: any;
  token: any;
};

const initialState: UserState = {
  user: null,
  token: null,
};

const UserSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    clearUser: state => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setToken, setUser, clearUser } =
  UserSlice.actions;
export default UserSlice.reducer;
