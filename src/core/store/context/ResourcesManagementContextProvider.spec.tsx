import { render, screen } from "@testing-library/react";

import TestingComponent from "resources-management/mocks/components/TestingComponent";
import ResourcesManagementContextProvider from "./ResourcesManagementContextProvider";

describe("Given a ResourcesManagementContextProvider provider", () => {
  describe("When is used", () => {
    test("Then it should contain the interventionData object available", () => {
      render(
        <ResourcesManagementContextProvider>
          <TestingComponent />
        </ResourcesManagementContextProvider>
      );

      const requestCode = screen.getByTestId("request-code");
      const operatingRoom = screen.getByTestId("operating-room");

      expect(requestCode.innerHTML).toEqual("0");
      expect(operatingRoom.innerHTML).toEqual("-");
    });
  });
});
