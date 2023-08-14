import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import snackbarReducer from "./snackbar/snackbar.reducer";

const rootReducer = combineReducers({
  snackbar: snackbarReducer,
});

const store = configureStore({ reducer: rootReducer });

export type AppState = ReturnType<typeof rootReducer>;
export default store;
