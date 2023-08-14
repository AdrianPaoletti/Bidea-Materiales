import React, { useState } from "react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";

import { fireEvent, render, renderHook, screen } from "@testing-library/react";

import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import store from "resources-management/core/store/redux";
import { resourceManagementContextMock } from "resources-management/mocks/context/resource-management-context.mock";
import { mockResourcesCategoriesDTO } from "resources-management/mocks/services/object-models.mock";
import i18n from "resources-management/statics/locales/i18n";
import FiltersHeader, { FiltersHeaderProps } from "./FiltersHeader";

let setActiveFiltersSpy: jest.SpyInstance<
  void,
  [value: React.SetStateAction<{}>],
  any
>;
const filtersHeaderProps: FiltersHeaderProps = {
  onBarcodeReaded: jest.fn(),
  resourcesCategories: mockResourcesCategoriesDTO,
  setActiveFilters: jest.fn(),
  chargeState: { total: 3, charged: 1 },
};

describe("Given a FiltersHeader component", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useState({}));
    setActiveFiltersSpy = jest.spyOn(result.current, "1");

    render(
      <ResourcesManagementContext.Provider
        value={resourceManagementContextMock}
      >
        <Provider store={store}>
          <FiltersHeader
            {...filtersHeaderProps}
            setActiveFilters={result.current[1]}
          />
        </Provider>
      </ResourcesManagementContext.Provider>
    );

    act(() => {
      i18n.init();
    });
  });

  describe("When is rendered", () => {
    test("Then it should appear the scanMaterialButton", () => {
      const scanMaterialButton = screen.getAllByRole("button")[1];

      expect(
        scanMaterialButton.innerHTML.includes("Escanear material")
      ).toBeTruthy();
    });
  });

  describe("When is rendered and interactions are made", () => {
    test("Then it should change the activeFilters after selecting a category from the multiselect filter and deleting it", () => {
      const listboxButton = screen.getAllByRole("button")[0];
      fireEvent.mouseDown(listboxButton);

      const equipmentsOption = screen.getAllByRole("option")[0];
      fireEvent.click(equipmentsOption);
      fireEvent.click(screen.getByTestId("CancelIcon"));

      expect(setActiveFiltersSpy).toHaveBeenCalled();
    });

    test("Then it should change the activeFilters after typing some text", () => {
      const nameDescriptionTextBox = screen.getAllByRole("textbox")[0];
      fireEvent.change(nameDescriptionTextBox, { target: { value: "spe" } });

      expect(setActiveFiltersSpy).toHaveBeenCalled();
    });
  });
});
