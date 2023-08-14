import { AlertColor } from "@mui/material";

import { snackbarActions } from "./snackbar.actions";
import { snackbarTypes } from "./snackbar.types";

describe("Given a setSnackbarMessage function", () => {
  describe("When is invoked", () => {
    test("Then it should return the expectedResult", () => {
      const mockPayload = {
        snackbarMessageTitle: "test",
        snackbarMessageSubtitle: "test",
        severity: "success" as AlertColor,
        autoHideDuration: 1000,
      };
      const expectedResult = {
        type: snackbarTypes.SET_SNACKBAR_MESSAGE,
        payload: mockPayload,
      };

      const result = snackbarActions.setSnackbarMessage(
        mockPayload.snackbarMessageTitle,
        mockPayload.snackbarMessageSubtitle,
        mockPayload.severity,
        mockPayload.autoHideDuration
      );

      expect(result).toEqual(expectedResult);
    });
  });
});

describe("Given a clearSnackbarMessage function", () => {
  describe("When is invoked", () => {
    test("Then it should return the expectedResult", () => {
      const expectedResult = {
        type: snackbarTypes.CLEAR_SNACKBAR_MESSAGE,
      };

      const result = snackbarActions.clearSnackbarMessage();

      expect(result).toEqual(expectedResult);
    });
  });
});
