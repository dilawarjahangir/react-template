import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../services/apiService";

const api = apiService();

export const fetchAssistants = createAsyncThunk("assistants/fetchAssistants", async () => {
  const response = await api.get("/api/admin/assistants");
  return response.data;
});

export const addAssistant = createAsyncThunk("assistants/addAssistant", async (assistant,  { rejectWithValue }) => {
  try {
    const response = await api.post("/api/admin/assistants/store", assistant);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Error creating assistant');
  }
});

export const updateAssistant = createAsyncThunk("assistants/updateAssistant", async (assistant) => {
  const response = await api.put(`/api/admin/assistants/${assistant.id}`, assistant);
  return response.data;
});

export const deleteAssistant = createAsyncThunk("assistants/deleteAssistant", async (id) => {
  await api.delete(`/api/admin/assistants/${id}`);
  return id;
});

export const fetchChatbotClass = createAsyncThunk('ChatbotClass/fetchChatbotClass', async (assistantId) => {
  const response = await api.get(`/api/admin/assistants/${assistantId}/chatbot-class`);
  return response.data;
});

export const updateChatbotClass = createAsyncThunk('ChatbotClass/updateChatbotClass', async ({ assistantId, contents }) => {
  const response = await api.put(`/api/admin/assistants/${assistantId}/chatbot-class`, { contents });
  return response.data;
});

export const fetchAPIClass = createAsyncThunk('APIClass/fetchAPIClass', async (assistantId) => {
  const response = await api.get(`/api/admin/assistants/${assistantId}/api-class`);
  return response.data;
});

export const updateAPIClass = createAsyncThunk('APIClass/updateAPIClass', async ({ assistantId, contents }) => {
  const response = await api.put(`/api/admin/assistants/${assistantId}/api-class`, { contents });
  return response.data;
});

const assistantsSlice = createSlice({
  name: "assistants",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssistants.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAssistants.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "succeeded";
      })
      .addCase(addAssistant.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateAssistant.fulfilled, (state, action) => {
        const index = state.list.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteAssistant.fulfilled, (state, action) => {
        state.list = state.list.filter((a) => a.id !== action.payload);
      })

      // Fetch LLM Tools
      .addCase(fetchChatbotClass.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatbotClass.fulfilled, (state, action) => {
        state.chatbot_class = action.payload.contents;
        state.status = 'succeeded';
      })

      // Update LLM Tools
      .addCase(updateChatbotClass.fulfilled, (state, action) => {
        state.chatbot_class = action.payload.contents;
      })

      // Fetch LLM Config
      .addCase(fetchAPIClass.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAPIClass.fulfilled, (state, action) => {
        state.api_class = action.payload.contents;
        state.status = 'succeeded';
      })

      // Update LLM Config
      .addCase(updateAPIClass.fulfilled, (state, action) => {
        state.api_class = action.payload.contents;
      })
  },
});

export default assistantsSlice.reducer;
