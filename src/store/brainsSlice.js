import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../services/apiService';

const api = apiService();

// Async actions
export const fetchBrains = createAsyncThunk('brains/fetchBrains', async (assistantId) => {
  const response = await api.get(`/api/admin/brains?assistant_id=${assistantId}`);
  return {
    brains: response.data.brains,
    defaultBrainId: response.data.default_brain_id, // Assuming API returns this
  };
});

export const setDefaultBrain = createAsyncThunk('brains/setDefaultBrain', async (brainId) => {
  const response = await api.put(`/api/admin/brains/${brainId}/set-default`);
  return response.data;
});

export const addBrain = createAsyncThunk('brains/addBrain', async (brainData) => {
  const response = await api.post('/api/admin/brains/store', brainData);
  return response.data;
});

export const deleteBrain = createAsyncThunk('brains/deleteBrain', async (brainId) => {
  const response = await api.delete(`/api/admin/brains/${brainId}`);
  return response.data;
});

export const editBrain = createAsyncThunk('brains/editBrain', async ({ brainId, brainData }) => {
  const response = await api.put(`/api/admin/brains/${brainId}`, brainData);
  return response.data;
});

export const fetchLLMTools = createAsyncThunk('llmTools/fetchLLMTools', async (brainId) => {
  const response = await api.get(`/api/admin/brains/${brainId}/llm-tools`);
  return response.data;
});

export const updateLLMTools = createAsyncThunk('llmTools/updateLLMTools', async ({ brainId, toolsContent }) => {
  const response = await api.put(`/api/admin/brains/${brainId}/llm-tools`, { toolsContent });
  return response.data;
});

export const fetchLLMConfig = createAsyncThunk('llmConfig/fetchLLMConfig', async (brainId) => {
  const response = await api.get(`/api/admin/brains/${brainId}/llm-config`);
  return response.data;
});

export const updateLLMConfig = createAsyncThunk('llmConfig/updateLLMConfig', async ({ brainId, configContent }) => {
  const response = await api.put(`/api/admin/brains/${brainId}/llm-config`, { configContent });
  return response.data;
});

// Slice
const brainsSlice = createSlice({
  name: 'brains',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch brains
      .addCase(fetchBrains.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBrains.fulfilled, (state, action) => {
        state.list = action.payload.brains;
        state.defaultBrainId = action.payload.defaultBrainId;
        state.status = 'succeeded';
      })
      .addCase(setDefaultBrain.fulfilled, (state, action) => {
        state.defaultBrainId = action.meta.arg; // Update default brain ID
      })

      .addCase(fetchBrains.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = 'failed';
      })

      // Add brain
      .addCase(addBrain.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // Delete brain
      .addCase(deleteBrain.fulfilled, (state, action) => {
        state.list = state.list.filter((brain) => brain.id !== action.meta.arg);
      })

      // Edit brain
      .addCase(editBrain.fulfilled, (state, action) => {
        const index = state.list.findIndex((brain) => brain.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      // Fetch LLM Tools
      .addCase(fetchLLMTools.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLLMTools.fulfilled, (state, action) => {
        state.llm_tools = action.payload.contents;
        state.status = 'succeeded';
      })

      // Update LLM Tools
      .addCase(updateLLMTools.fulfilled, (state, action) => {
        state.llm_tools = action.payload.contents;
      })

      // Fetch LLM Config
      .addCase(fetchLLMConfig.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLLMConfig.fulfilled, (state, action) => {
        state.llm_config = action.payload.contents;
        state.status = 'succeeded';
      })

      // Update LLM Config
      .addCase(updateLLMConfig.fulfilled, (state, action) => {
        state.llm_config = action.payload.contents;
      })

  },
});

export default brainsSlice.reducer;
