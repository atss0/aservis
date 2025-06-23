import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "parent" | "driver"
}

export interface UserState {
  user: User | null
  token: string | null
  role: "parent" | "driver" | null
}

const initialState: UserState = {
  user: null,
  token: null,
  role: null,
}

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setUser: (state, action: PayloadAction<{ user: User; role: "parent" | "driver" }>) => {
      state.user = action.payload.user
      state.role = action.payload.role
    },
    clearUser: (state) => {
      state.user = null
      state.token = null
      state.role = null
    },
    setRole: (state, action: PayloadAction<"parent" | "driver">) => {
      state.role = action.payload
    },
  },
})

export const { setToken, setUser, clearUser, setRole } = UserSlice.actions
export default UserSlice.reducer
