import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import * as preloadedResourcesService from "resources-management/core/services/preloaded-resources/preloaded-resources.service";
import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import store from "resources-management/core/store/redux";
import { resourceManagementContextMock } from "resources-management/mocks/context/resource-management-context.mock";
import {
  mockInterventionDTO,
  mockResourceForBookingDTO,
  mockResourcesCategoriesDTO,
} from "resources-management/mocks/services/object-models.mock";
import i18n from "resources-management/statics/locales/i18n";
import PreloadedResources, {
  PreloadedResourcesProps,
} from "./PreloadedResources";

const preloadedResourcesProps: PreloadedResourcesProps = {
  resourcesCategories: mockResourcesCategoriesDTO,
};
const getPreloadedResourcesSpy = jest.spyOn(
  preloadedResourcesService,
  "getPreloadedResources"
);
const getFamiliesSpy = jest.spyOn(preloadedResourcesService, "getFamilies");
const getResourcesSpy = jest.spyOn(preloadedResourcesService, "getResources");
const postResourcesSpy = jest.spyOn(preloadedResourcesService, "postResources");
const getAutomatedProposalSpy = jest.spyOn(
  preloadedResourcesService,
  "getAutomatedProposal"
);
const deleteResourceSpy = jest.spyOn(
  preloadedResourcesService,
  "deleteResource"
);
const { centroActual } = resourceManagementContextMock.clientSession;

const renderComponent = async () => {
  await waitFor(() => {
    render(
      <ResourcesManagementContext.Provider
        value={resourceManagementContextMock}
      >
        <Provider store={store}>
          <PreloadedResources {...preloadedResourcesProps} />
        </Provider>
      </ResourcesManagementContext.Provider>
    );
  });
};

describe("Given a PreloadedResources component", () => {
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
              <PreloadedResources {...preloadedResourcesProps} />
            </Provider>
          </ResourcesManagementContext.Provider>
        );
      });

      expect("Todavía no hay ninguna intervención seleccionada")
        .toBeInTheDocument;
    });

    test("Then it should call 'getPreloadedResources' if there is no error", async () => {
      await renderComponent();

      expect(getPreloadedResourcesSpy).toHaveBeenCalledWith(
        mockInterventionDTO,
        centroActual
      );
    });
  });

  describe("When is rendered and interactions are made", () => {
    test("Then it should call 'getFamilies' method after fyring the click event from the filters chips", async () => {
      await renderComponent();

      const staffChip = screen.getAllByRole("button")[2];
      fireEvent.click(staffChip);

      await waitFor(() => {
        expect(getFamiliesSpy).toHaveBeenCalledWith(
          "649010efdd4b7501f7cf9929",
          centroActual,
          mockInterventionDTO
        );
      });
    });

    test("Then it should call 'getResources' after fyring the click event from an option from the autocomplete filter", async () => {
      await renderComponent();

      const staffChip = screen.getAllByRole("button")[2];
      fireEvent.click(staffChip);
      const equipmentsChip = screen.getAllByRole("button")[1];
      fireEvent.click(equipmentsChip);
      const familiesDropdownButton =
        screen.getAllByTestId("ArrowDropDownIcon")[0];
      await waitFor(() => {
        fireEvent.click(familiesDropdownButton);
      });
      const familyOption = screen.getByRole("option");
      fireEvent.click(familyOption);
      const resourcesDropdownButton =
        screen.getAllByTestId("ArrowDropDownIcon")[1];
      await waitFor(() => {
        fireEvent.click(resourcesDropdownButton);
      });
      const resourceOption = screen.getByRole("option");
      fireEvent.click(resourceOption);

      await waitFor(() => {
        expect(getResourcesSpy).toHaveBeenCalledWith(
          "649010efdd4b7501f7cf9955",
          centroActual,
          mockInterventionDTO
        );
      });
    });

    test("Then it should call 'postResources' function after fyring the click event from the addResource button", async () => {
      await renderComponent();

      const staffChip = screen.getAllByRole("button")[6];
      fireEvent.click(staffChip);
      const familiesDropdownButton =
        screen.getAllByTestId("ArrowDropDownIcon")[2];
      await waitFor(() => {
        fireEvent.click(familiesDropdownButton);
      });
      const familyOption = screen.getByRole("option");
      fireEvent.click(familyOption);
      const resourcesDropdownButton =
        screen.getAllByTestId("ArrowDropDownIcon")[3];
      await waitFor(() => {
        fireEvent.click(resourcesDropdownButton);
      });
      const resourceOption = screen.getByRole("option");
      fireEvent.click(resourceOption);
      const addResourceButton = screen.getAllByRole("button")[9];
      fireEvent.click(addResourceButton);

      await waitFor(() => {
        expect(postResourcesSpy).toHaveBeenCalledWith(
          mockResourceForBookingDTO,
          mockInterventionDTO,
          centroActual
        );
      });
    });

    test("Then it should call 'getAutomatedProposal' function after fyring the click event from the assignProposal button", async () => {
      await renderComponent();

      const assignProposalButton = screen.getAllByRole("button")[11];
      fireEvent.click(assignProposalButton);

      await waitFor(() => {
        expect(getAutomatedProposalSpy).toHaveBeenCalledWith(
          mockInterventionDTO
        );
      });
    });

    test("Then it should call 'deleteResource' function after fyring the click event from the deleteButton", async () => {
      await renderComponent();

      const deleteIconButton = screen.getByTestId("DeleteOutlineIcon");
      fireEvent.click(deleteIconButton);
      const deleteButton = screen.getAllByRole("button")[3];
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(deleteResourceSpy).toHaveBeenCalledWith(
          mockResourceForBookingDTO.id,
          mockInterventionDTO,
          centroActual
        );
      });
    });
  });
});
