import React, { Dispatch } from "react";
import { useTranslation } from "react-i18next";

import CloseIcon from "@mui/icons-material/Close";
import { Alert, AlertTitle, IconButton, Slide, Snackbar } from "@mui/material";

import { SnackbarState } from "resources-management/core/models/snackbar-state.model";
import { snackbarActions } from "resources-management/core/store/redux/snackbar/snackbar.actions";

interface SnackbarProps {
  snackbarState: SnackbarState;
  dispatch: Dispatch<{ type: string }>;
}

const SnackbarAlert = ({
  snackbarState: {
    open,
    severity,
    snackbarMessageTitle,
    snackbarMessageSubtitle,
    autoHideDuration,
  },
  dispatch,
}: SnackbarProps) => {
  const { t } = useTranslation(["common", "errors"]);

  const handleClose = () => {
    dispatch(snackbarActions.clearSnackbarMessage());
  };

  return (
    <Snackbar
      key={Date.now()}
      autoHideDuration={autoHideDuration}
      TransitionComponent={(props) => (
        <Slide {...props} direction="up" in={open} mountOnEnter unmountOnExit />
      )}
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{ marginRight: "0.5rem" }}
      onClose={(event, reason) => {
        reason !== "clickaway" && handleClose();
      }}
    >
      <Alert
        severity={severity ? severity : "warning"}
        action={
          <IconButton onClick={() => handleClose()}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <AlertTitle sx={{ paddingRight: "2rem" }}>
          {t(snackbarMessageTitle)}
        </AlertTitle>
        {t(snackbarMessageSubtitle)}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
