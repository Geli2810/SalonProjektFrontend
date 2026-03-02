import {configureStore} from "@reduxjs/toolkit";
import customersReducer from "./Slices/CustomersSlice";

const store = configureStore({
    reducer: {
        customers: customersReducer,
    },
});

export default store;