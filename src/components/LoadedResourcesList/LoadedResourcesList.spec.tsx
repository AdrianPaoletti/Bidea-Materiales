import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import * as loadedResourceListService from "resources-management/core/services/loaded-resources-list/loaded-resources-list.service";
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
import LoadedResourcesList, {
  LoadedResourcesListProps,
} from "./LoadedResourcesList";

const loadedResourcesListProps: LoadedResourcesListProps = {
  resourcesCategories: mockResourcesCategoriesDTO,
};
const queryBookingTrackingsSpy = jest.spyOn(
  followedMaterialsApi,
  "queryBookingTrackings"
);
const deleteTrackingRequestSpy = jest.spyOn(
  followedMaterialsApi,
  "deleteTrackingRequest"
);
const mergeBookingTrackingSpy = jest.spyOn(
  followedMaterialsApi,
  "mergeBookingTracking"
);
const newOrUpdateTrackingRequestSpy = jest.spyOn(
  loadedResourceListService,
  "newOrUpdateTrackingRequest"
);

const renderComponent = async () => {
  await waitFor(() => {
    render(
      <ResourcesManagementContext.Provider
        value={resourceManagementContextMock}
      >
        <Provider store={store}>
          <LoadedResourcesList {...loadedResourcesListProps} />
        </Provider>
      </ResourcesManagementContext.Provider>
    );
  });
};

describe("Given a ChargeToPatient component", () => {
  beforeAll(() => {
    act(() => {
      i18n.init();
    });
  });

  describe("When is rendered", () => {
    test("Then it should call 'queryBookingTrackings'", async () => {
      await renderComponent();

      expect(queryBookingTrackingsSpy).toHaveBeenCalledWith({
        queryBookingTrackingsRequest: {
          filters: {
            hubInternalCode: mockInterventionDTO.hub,
            interventionRequestCode: mockInterventionDTO.requestCode,
          },
        },
      });
    });

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
              <LoadedResourcesList {...loadedResourcesListProps} />
            </Provider>
          </ResourcesManagementContext.Provider>
        );
      });

      expect("Todavía no hay ninguna intervención seleccionada")
        .toBeInTheDocument;
    });
  });

  describe("When is rendered and interaction are made", () => {
    test("Then it should call 'deleteTrackingRequest' method after fyring the click event from the delete button", async () => {
      await renderComponent();

      const deleteIcon = screen.getAllByTestId("DeleteOutlineIcon")[0];
      fireEvent.click(deleteIcon);
      const deleteButton = screen.getAllByRole("button")[1];
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(deleteTrackingRequestSpy).toHaveBeenCalledWith({
          bookingRequestId: mockFullBookingTrackingDTO.id,
        });
      });
    });

    test("Then it should call 'newOrUpdateTrackingRequestSpy' function after doing a barcode reading", async () => {
      await renderComponent();

      const scanMaterialButton = screen.getAllByRole("button")[2];
      fireEvent.click(scanMaterialButton);
      const barcodeInput = screen.getAllByRole("textbox")[0];
      fireEvent.change(barcodeInput, { target: { value: "123456" } });
      const submitButton = screen.getAllByRole("button")[3];
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(newOrUpdateTrackingRequestSpy).toHaveBeenCalled();
      });
    });

    test("Then it should call 'mergeBookingTrackingSpy' function after merging the row", async () => {
      await renderComponent();

      const optionsButton = screen.getAllByTestId("MoreHorizIcon")[0];
      fireEvent.click(optionsButton);
      const mergeMaterialOpcion = screen.getAllByRole("menuitem")[0];
      fireEvent.click(mergeMaterialOpcion);
      const mergeIconButton = screen.getAllByTestId("MergeIcon")[0];
      fireEvent.click(mergeIconButton);

      await waitFor(() => {
        expect(mergeBookingTrackingSpy).toHaveBeenCalled();
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
