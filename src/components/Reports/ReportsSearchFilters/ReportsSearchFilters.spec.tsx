import { useState } from "react";
import { Provider } from "react-redux";

import "dayjs/locale/es";
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import store from "resources-management/core/store/redux";
import { resourceManagementContextMock } from "resources-management/mocks/context/resource-management-context.mock";
import { mockResourcesCategoriesDTO } from "resources-management/mocks/services/object-models.mock";
import i18n from "resources-management/statics/locales/i18n";
import ReportsSearchFilters, {
  ReportsSearchFiltersProps,
} from "./ReportsSearchFilters";

let setReportQueryFiltersSpy: jest.SpyInstance<
  void,
  [value: React.SetStateAction<{}>],
  any
>;
let setSelectedOperatingRoomsAndCategoriesSpy: jest.SpyInstance<
  void,
  [value: React.SetStateAction<{}>],
  any
>;
const reportsSearchFiltersProps: ReportsSearchFiltersProps = {
  reportQueryFilters: {
    hub: "1",
    interventionRequestCode: 1,
    operatingRoomExternalCodes: [{ name: "test", id: "test" }],
    categoryIds: [{ name: "test", id: "test" }],
    dateFrom: "2023-06-20T10:15:04.227Z",
    dateTo: "2023-06-20T10:15:04.227Z",
  },
  setReportQueryFilters: jest.fn(),
  selectedOperatingRoomsAndCategories: {
    operatingRoomExternalCodes: ["test"],
    categoryIds: ["test"],
  },
  setSelectedOperatingRoomsAndCategories: jest.fn(),
  operatingRooms: [{ name: "test", id: "test" }],
  resourcesCategories: mockResourcesCategoriesDTO,
  isLoading: false,
  handleSubmit: jest.fn(),
};

describe("Given a Reports component", () => {
  beforeAll(async () => {
    await waitFor(() => {
      i18n.init();
    });
  });

  beforeEach(async () => {
    const { result: reportQueryFiltersState } = renderHook(() => useState({}));
    const { result: selectedOperatingRoomsAndCategoriesState } = renderHook(
      () => useState({})
    );
    setReportQueryFiltersSpy = jest.spyOn(reportQueryFiltersState.current, "1");
    setSelectedOperatingRoomsAndCategoriesSpy = jest.spyOn(
      selectedOperatingRoomsAndCategoriesState.current,
      "1"
    );
    await waitFor(() => {
      render(
        <ResourcesManagementContext.Provider
          value={resourceManagementContextMock}
        >
          <Provider store={store}>
            <ReportsSearchFilters
              {...reportsSearchFiltersProps}
              setReportQueryFilters={reportQueryFiltersState.current[1]}
              setSelectedOperatingRoomsAndCategories={
                selectedOperatingRoomsAndCategoriesState.current[1]
              }
            />
          </Provider>
        </ResourcesManagementContext.Provider>
      );
    });
  });

  describe("When is rendered and interactions are made", () => {
    test("Then it should call 'setSelectedOperatingRoomsAndCategories' and 'setReportQueryFilters' after selecting an option from a list box and deleting it", async () => {
      const listboxOperatingRoomsButton = screen.getAllByRole("button")[2];
      fireEvent.mouseDown(listboxOperatingRoomsButton);
      const operatingRoomOption = screen.getAllByRole("option")[0];
      fireEvent.click(operatingRoomOption);
      fireEvent.click(screen.getAllByTestId("CancelIcon")[0]);

      expect(setReportQueryFiltersSpy).toHaveBeenCalled();
      expect(setSelectedOperatingRoomsAndCategoriesSpy).toHaveBeenCalled();
    });

    test("Then it should call 'setReportQueryFilters' after fyring the change event from the input and deleting it", async () => {
      const dateFromInput = screen.getAllByRole("textbox")[0];
      userEvent.type(dateFromInput, "05/01/2021", { delay: 1 });
      fireEvent.change(dateFromInput, { target: { value: "05/01/2021" } });
      const clearIcon = screen.getByTestId("ClearIcon");
      fireEvent.click(clearIcon);

      expect(setReportQueryFiltersSpy).toHaveBeenCalled();
    });
  });
});
