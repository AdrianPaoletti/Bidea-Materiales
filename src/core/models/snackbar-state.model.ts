import { AlertColor } from "@mui/material";

export interface SnackbarState {
  snackbarMessageTitle: string;
  snackbarMessageSubtitle: string;
  severity: AlertColor | "";
  autoHideDuration: number;
  open?: boolean;
}
