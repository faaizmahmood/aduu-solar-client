import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    projectId: null,
    formData: {}, // Stores data for each service form
};

const orderServiceSlice = createSlice({
    name: 'orderService',
    initialState,
    reducers: {
        setProject: (state, action) => {
            state.projectId = action.payload;
        },
        updateFormData: (state, action) => {
            const { serviceId, data } = action.payload;
            state.formData[serviceId] = data; // Save data for each form
        },
        clearOrderService: (state) => {
            state.projectId = null;
            state.formData = {};
        },
    },
});

export const { setProject, updateFormData, clearOrderService } = orderServiceSlice.actions;
export default orderServiceSlice.reducer;