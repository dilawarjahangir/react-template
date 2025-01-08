import { configureStore } from "@reduxjs/toolkit";
import devicesReducer from "./devicesSlice";
import customersReducer from "./customersSlice";
import assistantsReducer from "./assistantsSlice";
import brainsReducer from "./brainsSlice";
import placeholdersSlice from "./placeholdersSlice";
import developersReducer from "./developersSlice";

const store = configureStore({
  reducer: {
    devices: devicesReducer,
    customers: customersReducer,
    assistants: assistantsReducer,
    brains: brainsReducer,
    placeholders: placeholdersSlice,
    developers: developersReducer,
  },
});

export default store;
