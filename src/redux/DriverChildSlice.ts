import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface DriverStudent {
    id: number
    name: string
    pickup_lat: string
    pickup_lng: string
    dropoff_lat: string
    dropoff_lng: string
    grade: string
    school: string
    pickup_time: string
    dropoff_time: string
    parent: {
        id: number
        name: string
        phone: string
    }
}

interface DriverChildState {
    students: DriverStudent[]
}

const initialState: DriverChildState = {
    students: [],
}

const driverChildSlice = createSlice({
    name: 'driverChildren',
    initialState,
    reducers: {
        setDriverChildren: (state, action) => {
            state.students = action.payload
        },
        updateDriverChildren: (state, action) => {
            const index = state.students.findIndex(s => s.id === action.payload.id)
            if (index !== -1) {
                state.students[index] = action.payload
            }
        },
        clearDriverChildren: (state) => {
            state.students = []
        }
    }
})

export const { setDriverChildren, updateDriverChildren, clearDriverChildren } = driverChildSlice.actions
export default driverChildSlice.reducer