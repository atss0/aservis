import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ApproachState {
  outerRadius: number
  innerRadius: number
}

const initialState: ApproachState = {
  outerRadius: 500,
  innerRadius: 100,
}

const approachSlice = createSlice({
  name: "approach",
  initialState,
  reducers: {
    setOuterRadius: (state, action: PayloadAction<number>) => {
      state.outerRadius = action.payload
    },
    setInnerRadius: (state, action: PayloadAction<number>) => {
      state.innerRadius = action.payload
    },
    resetRadius: () => initialState,
  },
})

export const { setOuterRadius, setInnerRadius, resetRadius } = approachSlice.actions
export default approachSlice.reducer