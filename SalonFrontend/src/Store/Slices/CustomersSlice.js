import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://salonproject.onrender.com/api/HairDresserSalon";

export const fetchCustomers = createAsyncThunk("salon/fetchCustomers", async () => {
  const response = await axios.get(`${API_BASE_URL}/kunder`);
  return response.data;
});

export const fetchBehandlinger = createAsyncThunk("salon/fetchBehandlinger", async () => {
  const response = await axios.get(`${API_BASE_URL}/behandlinger`);
  return response.data;
});

export const fetchFrisorer = createAsyncThunk("salon/fetchFrisorer", async () => {
  const response = await axios.get(`${API_BASE_URL}/frisorer`);
  return response.data;
});

const initialState = {
  customers: [],
  behandlinger: [],
  frisorer: [],
  status: "idle",
  error: null,
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Kunne ikke hente kunder";
      })
      .addCase(fetchBehandlinger.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBehandlinger.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.behandlinger = action.payload;
      })
      .addCase(fetchBehandlinger.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Kunne ikke hente behandlinger";
      })
      .addCase(fetchFrisorer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFrisorer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.frisorer = action.payload;
      })
      .addCase(fetchFrisorer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Kunne ikke hente frisorer";
      });
  },
});

export default customersSlice.reducer;
