import { SnackbarState } from "resources-management/core/models/snackbar-state.model";
import { snackbarTypes } from "./snackbar.types";

interface ActionType {
  type: string;
  payload: SnackbarState;
  error?: boolean;
}

export const initialState: SnackbarState = {
  snackbarMessageTitle: "",
  snackbarMessageSubtitle: "",
  severity: "",
  autoHideDuration: 3000,
  open: false,
};

const snackbarReducer = (state = initialState, action: ActionType) => {
  switch (action.type) {
    case snackbarTypes.SET_SNACKBAR_MESSAGE:
      return {
        snackbarMessageTitle: action.payload.snackbarMessageTitle,
        snackbarMessageSubtitle: action.payload.snackbarMessageSubtitle,
        severity: action.payload.severity,
        autoHideDuration: action.payload.autoHideDuration,
        open: true,
      };
    case snackbarTypes.CLEAR_SNACKBAR_MESSAGE:
      return initialState;
    default:
      return state;
  }
};

export default snackbarReducer;
