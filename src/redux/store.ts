import { configureStore } from "@reduxjs/toolkit"
import UserSlice from "./UserSlice"
import ChildSlice from "./ChildSlice"
import ApproachSlice from "./ApproachSlice"
import DriverChildSlice from "./DriverChildSlice"
import RideProgressSlice from "./RideProgressSlice"

const store = configureStore({
  reducer: {
    User: UserSlice,
    Child: ChildSlice,
    Approach: ApproachSlice,
    DriverChild: DriverChildSlice,
    RideProgress: RideProgressSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
