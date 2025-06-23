import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type RideStatus = "waiting" | "picked_up" | "dropped_off"

interface State {
  byId: Record<number, RideStatus>
}
const initialState: State = { byId: {} }

const rideProgressSlice = createSlice({
  name: "rideProgress",
  initialState,
  reducers: {
    initWaiting: (s, a: PayloadAction<number[]>) => {
      a.payload.forEach(id => { s.byId[id] = "waiting" })
    },
    setPickedUp:  (s, a: PayloadAction<number>) => { s.byId[a.payload] = "picked_up" },
    setDroppedOff:(s, a: PayloadAction<number>) => { s.byId[a.payload] = "dropped_off" },
    clearRide: () => initialState,
  },
})

export const { initWaiting, setPickedUp, setDroppedOff, clearRide } = rideProgressSlice.actions
export default rideProgressSlice.reducer