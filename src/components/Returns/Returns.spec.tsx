import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { followedMaterialsApi } from "resources-management/core/services/resources-management-api-typescript-fetch/resources-management-api.service";
import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import store from "resources-management/core/store/redux";
import { resourceManagementContextMock } from "resources-management/mocks/context/resource-management-context.mock";
import {
  mockFullBookingTrackingDTO,
  mockInterventionDTO,
  mockResourcesCategoriesDTO,
} from "resources-management/mocks/services/object-models.mock";
import i18n from "resources-management/statics/locales/i18n";
import * as trackingRequestsService from "../../core/services/tracking-requests/tracking-requests.service";
import * as utils from "../../utils/returns/returns.utils";
import Returns, { ReturnsProps } from "./Returns";

const returnsProps: ReturnsProps = {
  resourcesCategories: mockResourcesCategoriesDTO,
};
const queryBookingTrackingsSpy = jest.spyOn(
  followedMaterialsApi,
  "queryBookingTrackings"
);
const updateTrackingRequestStateSpy = jest.spyOn(
  trackingRequestsService,
  "updateTrackingRequestState"
);
const matchReadingWithTrackingSpy = jest.spyOn(
  utils,
  "matchReadingWithTracking"
);

const renderComponent = async () => {
  await waitFor(() => {
    render(
      <ResourcesManagementContext.Provider
        value={resourceManagementContextMock}
      >
        <Provider store={store}>
          <Returns {...returnsProps} />
        </Provider>
      </ResourcesManagementContext.Provider>
    );
  });
};

describe("Given a Returns component", () => {
  beforeAll(() => {
    act(() => {
      i18n.init();
    });
  });

  describe("When is rendered", () => {
    test("Then it should render 'Todavía no hay ninguna intervención seleccionada' when interventionData.hub is '-'", async () => {
      await waitFor(() => {
        render(
          <ResourcesManagementContext.Provider
            value={{
              ...resourceManagementContextMock,
              interventionData: {
                ...resourceManagementContextMock.interventionData,
                hub: "-",
              },
            }}
          >
            <Provider store={store}>
              <Returns {...returnsProps} />
            </Provider>
          </ResourcesManagementContext.Provider>
        );
      });

      expect("Todavía no hay ninguna intervención seleccionada")
        .toBeInTheDocument;
    });

    test("Then it should call 'queryBookingTrackings' when interventionData.hub is different to '-'", async () => {
      await renderComponent();

      await waitFor(() => {
        expect(queryBookingTrackingsSpy).toHaveBeenCalledWith({
          queryBookingTrackingsRequest: {
            pagination: { page: 0, offset: 10 },
            filters: {
              hubInternalCode: mockInterventionDTO.hub,
              interventionRequestCode: mockInterventionDTO.requestCode,
            },
          },
        });
      });
    });
  });

  describe("When is rendered and interactions are made", () => {
    test("Then it should call 'updateTrackingRequestState' after fyring the click event from the barcodeReading button and finding a match with a tracking", async () => {
      await renderComponent();

      const scanMaterialButton = screen.getAllByRole("button")[2];
      fireEvent.click(scanMaterialButton);
      const barcodeInput = screen.getAllByRole("textbox")[0];
      fireEvent.change(barcodeInput, {
        target: { value: mockFullBookingTrackingDTO.barcodeReading?.id },
      });
      const submitButton = screen.getAllByRole("button")[3];
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(updateTrackingRequestStateSpy).toHaveBeenCalledWith(
          mockFullBookingTrackingDTO,
          "PRE_WAREHOUSE_DEVOLUTION"
        );
      });
    });

    test("Then it should call 'queryBookingTrackings'  after fyring the click event from the barcodeReading button and not finding a match with a tracking", async () => {
      await renderComponent();

      matchReadingWithTrackingSpy.mockReturnValue(undefined);
      const scanMaterialButton = screen.getAllByRole("button")[2];
      fireEvent.click(scanMaterialButton);
      const barcodeInput = screen.getAllByRole("textbox")[0];
      fireEvent.change(barcodeInput, {
        target: { value: "1236" },
      });
      const submitButton = screen.getAllByRole("button")[3];
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(queryBookingTrackingsSpy).toHaveBeenCalledWith({
          queryBookingTrackingsRequest: {
            pagination: { page: 0, offset: 10 },
            filters: {
              hubInternalCode: mockInterventionDTO.hub,
              interventionRequestCode: mockInterventionDTO.requestCode,
            },
          },
        });
      });
    });

    test("Then it should have less rows the table after interacting with the filters", async () => {
      await renderComponent();

      const prevRowsNumber = screen.getAllByRole("row").length;
      const nameDescriptionTextBox = screen.getAllByRole("textbox")[1];
      fireEvent.change(nameDescriptionTextBox, { target: { value: "spe" } });
      const refferenceTextBox = screen.getAllByRole("textbox")[2];
      fireEvent.change(refferenceTextBox, { target: { value: "spe" } });
      const rowsNumber = screen.getAllByRole("row").length;

      const listboxButton = screen.getAllByRole("button")[1];
      fireEvent.mouseDown(listboxButton);
      const equipmentsOption = screen.getAllByRole("option")[0];
      fireEvent.click(equipmentsOption);

      expect(rowsNumber).toBeLessThan(prevRowsNumber);
    });
  });
});
