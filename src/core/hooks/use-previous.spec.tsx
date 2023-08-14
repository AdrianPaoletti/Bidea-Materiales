import { useState } from "react";

import { renderHook } from "@testing-library/react";

import usePrevious from "./use-previous";

describe("Given an usePrevious custom hook", () => {
  describe("When is called", () => {
    test("Then it should return the previous value", () => {

      const {
        result: {
          current: [value, setValue],
        },
      } = renderHook(() => useState(5));

      const {
        result: { current: prevValue },
      } = renderHook(() => usePrevious(value));
      
      expect(prevValue).toEqual(null);
    });
  });
});
