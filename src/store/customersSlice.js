import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../services/apiService';

const api = apiService();

export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async () => {
  const response = await api.get('/api/admin/customers');
  return response.data;
});

export const addCustomer = createAsyncThunk('customers/addCustomer', async (customer) => {
  const response = await api.post('/api/admin/customers', customer);
  return response.data;
});

export const updateCustomer = createAsyncThunk('customers/updateCustomer', async (customer) => {
  const response = await api.put(`/api/admin/customers/${customer.id}`, customer);
  return response.data;
});

export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async (id) => {
  await api.delete(`/api/admin/customers/${id}`);
  return id;
});

export const toggleCustomerStatus = createAsyncThunk('customers/toggleCustomerStatus', async (id) => {
  const response = await api.patch(`/api/admin/customers/${id}/status`);
  return response.data;
});

const customersSlice = createSlice({
  name: 'customers',
  initialState: { list: [], status: 'idle', error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      })
      .addCase(toggleCustomerStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default customersSlice.reducer;
