import { act } from "react-dom/test-utils";
import { useTranslation } from "react-i18next";
import { Provider } from "react-redux";

import { fireEvent, render, renderHook, screen } from "@testing-library/react";

import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import store from "resources-management/core/store/redux";
import { mockLoadedResourcesTableRow } from "resources-management/mocks/components/loaded-resources-list.mock";
import { resourceManagementContextMock } from "resources-management/mocks/context/resource-management-context.mock";
import { mockResourcesCategoriesDTO } from "resources-management/mocks/services/object-models.mock";
import i18n from "resources-management/statics/locales/i18n";
import getLoadedResourcesTableColumns from "resources-management/utils/loaded-resources-list/loaded-resources-table-columns";
import DeleteConfirmation from "./DeleteConfirmation";

const {
  result: { current: mockUseTranslationResponse },
} = renderHook(() => useTranslation());
const deleteConfirmationProps = {
  columns: getLoadedResourcesTableColumns(
    mockResourcesCategoriesDTO,
    mockUseTranslationResponse,
    [],
    jest.fn()
  ),
  isOpen: true,
  setIsOpen: jest.fn(),
  row: mockLoadedResourcesTableRow,
  handleDelete: jest.fn(),
};

describe("Given a DeleteConfirmation component", () => {
  beforeEach(() => {
    render(
      <ResourcesManagementContext.Provider
        value={resourceManagementContextMock}
      >
        <Provider store={store}>
          <DeleteConfirmation {...deleteConfirmationProps} />
        </Provider>
      </ResourcesManagementContext.Provider>
    );

    act(() => {
      i18n.init();
    });
  });

  describe("When is rendered", () => {
    test("Then it should render the cancelButton and the deleteButton", () => {
      const [button, cancelButton, deleteButton] =
        screen.getAllByRole("button");
      const cancelButtonText = cancelButton.innerHTML.split("<")[0];
      const deleteButtonText = deleteButton.innerHTML.split("<")[0];

      expect(cancelButtonText).toBe("Cancelar");
      expect(deleteButtonText).toBe("Eliminar");
    });
  });

  describe("When is rendered and interactions are made", () => {
    test("Then it should call setIsOpen function after fyring the click event from the cancelButton", () => {
      const cancelButton = screen.getAllByRole("button")[1];

      fireEvent.click(cancelButton);

      expect(deleteConfirmationProps.setIsOpen).toHaveBeenCalledWith(false);
    });

    test("Then it should call handleDelete function after fyring the click event from the deleteButton", () => {
      const deleteButton = screen.getAllByRole("button")[2];

      fireEvent.click(deleteButton);

      expect(deleteConfirmationProps.handleDelete).toHaveBeenCalled();
    });
  });
});
