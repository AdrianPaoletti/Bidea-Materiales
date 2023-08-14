import { AlertColor } from "@mui/material";

import snackbarReducer, { initialState } from "./snackbar.reducer";
import { snackbarTypes } from "./snackbar.types";

const mockPayload = {
  snackbarMessageTitle: "test",
  snackbarMessageSubtitle: "test",
  severity: "success" as AlertColor,
  autoHideDuration: 1000,
  open: false,
};

describe("Given a snackbarReducer reducer", () => {
  describe("When is invoked with snackbarTypes.SET_SNACKBAR_MESSAGE", () => {
    test("Then it should set open property to true", () => {
      const mockAction = {
        type: snackbarTypes.SET_SNACKBAR_MESSAGE,
        payload: mockPayload,
      };
      const expecteResult = { ...mockPayload, open: true };

      const result = snackbarReducer(mockPayload, mockAction);

      expect(result).toEqual(expecteResult);
    });
  });

  describe("When is invoked with snackbarTypes.CLEAR_SNACKBAR_MESSAGE", () => {
    test("Then it should return the initial state", () => {
      const mockAction = {
        type: snackbarTypes.CLEAR_SNACKBAR_MESSAGE,
        payload: mockPayload,
      };
      const expecteResult = initialState;

      const result = snackbarReducer(mockPayload, mockAction);

      expect(result).toEqual(expecteResult);
    });
  });
});
