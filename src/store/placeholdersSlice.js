import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../services/apiService';

const api = apiService();

// Fetch placeholders for a specific brain
export const fetchPlaceholders = createAsyncThunk(
  'placeholders/fetchPlaceholders',
  async (brainId) => {
    const response = await api.get(`/api/placeholders?brain_id=${brainId}`);
    return response.data;
  }
);

// Add a new placeholder
export const addPlaceholder = createAsyncThunk(
  'placeholders/addPlaceholder',
  async ({ brainId, placeholderData }) => {
    const response = await api.post(`/api/placeholders`, {
      brain_id: brainId,
      ...placeholderData,
    });
    return response.data;
  }
);

// Update placeholders (single or bulk)
export const updatePlaceholder = createAsyncThunk(
  'placeholders/updatePlaceholder',
  async ({ placeholderId, placeholderData }) => {
    // If placeholderId is null, it indicates a bulk update
    if (placeholderId === null) {
      const response = await api.put(`/api/placeholders/bulk-update`, {
        placeholders: placeholderData,
      });
      return response.data; // Expect an updated list of placeholders from the server
    } else {
      const response = await api.put(`/api/placeholders/${placeholderId}`, placeholderData);
      return response.data; // Expect the updated placeholder from the server
    }
  }
);

// Delete a placeholder
export const deletePlaceholder = createAsyncThunk(
  'placeholders/deletePlaceholder',
  async (placeholderId) => {
    const response = await api.delete(`/api/placeholders/${placeholderId}`);
    return response.data;
  }
);

const placeholdersSlice = createSlice({
  name: 'placeholders',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Placeholders
      .addCase(fetchPlaceholders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlaceholders.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchPlaceholders.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = 'failed';
      })
      // Add Placeholder
      .addCase(addPlaceholder.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update Placeholder(s)
      .addCase(updatePlaceholder.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          // Bulk update
          state.list = action.payload;
        } else {
          // Single update
          const index = state.list.findIndex((p) => p.id === action.payload.id);
          if (index !== -1) {
            state.list[index] = action.payload;
          }
        }
      })
      // Delete Placeholder
      .addCase(deletePlaceholder.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.meta.arg);
      });
  },
});

export default placeholdersSlice.reducer;
