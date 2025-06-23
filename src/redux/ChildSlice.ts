import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Child {
  id: number
  name: string
  parent_id: number
  grade: string
  school: string
  pickup_lat: string
  pickup_lng: string
  dropoff_lat: string
  dropoff_lng: string
  pickup_time: string
  dropoff_time: string
  created_at: string
  updated_at: string
}

export interface ChildState {
  children: Child[]
}

const initialState: ChildState = {
  children: [],
}

const ChildSlice = createSlice({
  name: "children",
  initialState,
  reducers: {
    setChildren: (state, action: PayloadAction<Child[]>) => {
      state.children = action.payload
    },
    updateChild: (state, action: PayloadAction<Child>) => {
      const index = state.children.findIndex(c => c.id === action.payload.id)
      if (index !== -1) {
        state.children[index] = action.payload
      }
    },
    clearChildren: (state) => {
      state.children = []
    },
  },
})

export const { setChildren, updateChild, clearChildren } = ChildSlice.actions
export default ChildSlice.reducer