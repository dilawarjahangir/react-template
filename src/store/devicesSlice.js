import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../services/apiService";

const api = apiService();

export const fetchDevices = createAsyncThunk("devices/fetchDevices", async () => {
  const response = await api.get('/api/admin/devices');
  return response.data;
});

export const fetchAssistants = createAsyncThunk('devices/fetchAssistants', async () => {
  const response = await api.get('/api/admin/devices/assistants');
  return response.data;
});

export const addDevice = createAsyncThunk("devices/addDevice", async (device) => {
  const response = await api.post('/api/admin/devices/store', device);
  return response.data;
});

export const updateDevice = createAsyncThunk("devices/updateDevice", async (device) => {
  const response = await api.put('/api/admin/devices/${device.id}', device);
  return response.data;
});

export const deleteDevice = createAsyncThunk("devices/deleteDevice", async (id) => {
  await api.delete('/api/admin/devices/${id}');
  return id;
});

const devicesSlice = createSlice({
  name: "devices",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAssistants.fulfilled, (state, action) => {
        state.assistants = action.payload;
      })
      .addCase(addDevice.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        const index = state.list.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d.id !== action.payload);
      });
  },
});

export default devicesSlice.reducer;
