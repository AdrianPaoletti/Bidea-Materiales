import { AlertColor } from "@mui/material";

import { snackbarTypes } from "./snackbar.types";

const setSnackbarMessage = (
  snackbarMessageTitle: string,
  snackbarMessageSubtitle: string,
  severity: AlertColor,
  autoHideDuration: number
) => {
  return {
    type: snackbarTypes.SET_SNACKBAR_MESSAGE,
    payload: {
      snackbarMessageTitle,
      snackbarMessageSubtitle,
      severity,
      autoHideDuration,
    },
  };
};
const clearSnackbarMessage = () => {
  return {
    type: snackbarTypes.CLEAR_SNACKBAR_MESSAGE,
  };
};

export const snackbarActions = {
  setSnackbarMessage,
  clearSnackbarMessage,
};
