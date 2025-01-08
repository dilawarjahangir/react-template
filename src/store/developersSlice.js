import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../services/apiService';

const api = apiService();

export const fetchDevelopers = createAsyncThunk('developers/fetchDevelopers', async () => {
  const response = await api.get('/api/admin/developers');
  return response.data;
});

export const addDeveloper = createAsyncThunk('developers/addDeveloper', async (developer) => {
  const response = await api.post('/api/admin/developers', developer);
  return response.data;
});

export const updateDeveloper = createAsyncThunk('developers/updateDeveloper', async (developer) => {
  const response = await api.put(`/api/admin/developers/${developer.id}`, developer);
  return response.data;
});

export const deleteDeveloper = createAsyncThunk('developers/deleteDeveloper', async (id) => {
  await api.delete(`/api/admin/developers/${id}`);
  return id;
});

export const toggleDeveloperStatus = createAsyncThunk('developers/toggleDeveloperStatus', async (id) => {
  const response = await api.patch(`/api/admin/developers/${id}/status`);
  return response.data;
});

const developersSlice = createSlice({
  name: 'developers',
  initialState: { list: [], status: 'idle', error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevelopers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchDevelopers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchDevelopers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addDeveloper.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateDeveloper.fulfilled, (state, action) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteDeveloper.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      })
      .addCase(toggleDeveloperStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default developersSlice.reducer;
