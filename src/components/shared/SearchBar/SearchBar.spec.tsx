import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import store from "resources-management/core/store/redux";
import { resourceManagementContextMock } from "resources-management/mocks/context/resource-management-context.mock";
import { mockInterventionDTO } from "resources-management/mocks/services/object-models.mock";
import i18n from "resources-management/statics/locales/i18n";
import SearchBar, { SearchBarProps } from "./SearchBar";

const searchBarProps: SearchBarProps = { setInterventionData: jest.fn() };

describe("Given a SearchBar component", () => {
  beforeAll(() => {
    act(() => {
      i18n.init();
    });
  });
  beforeEach(() => {
    render(
      <ResourcesManagementContext.Provider
        value={resourceManagementContextMock}
      >
        <Provider store={store}>
          <SearchBar {...searchBarProps} />
        </Provider>
      </ResourcesManagementContext.Provider>
    );
  });

  describe("When is rendered and interactions are made", () => {
    test("Then it should call 'setInterventionData' after fyring the click event from the submit button", async () => {
      const searchButton = screen.getByRole("button");
      const searchInput = screen.getByRole("textbox");

      fireEvent.change(searchInput, { target: { value: "test" } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(searchBarProps.setInterventionData).toHaveBeenCalledWith(
          mockInterventionDTO
        );
      });
    });
  });
});
