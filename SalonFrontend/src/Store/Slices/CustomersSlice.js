import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCustomers = createAsyncThunk(
    'customers/fetchCustomers',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get('https://salonproject.onrender.com/api/HairDresserSalon', {
                timeout: 10000,
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                return rejectWithValue(`Server returned ${error.response.status}`);
            }

            if (error.code === 'ECONNABORTED') {
                return rejectWithValue('Request timed out');
            }

            return rejectWithValue(error.message || 'Failed to fetch customers');
        }
    }
);

const customersSlice = createSlice({
    name: 'customers',
    initialState: {
        customers: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.customers = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            });
        },
});

export default customersSlice.reducer;