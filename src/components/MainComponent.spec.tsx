import { Provider } from "react-redux";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import store from "resources-management/core/store/redux";
import { resourceManagementContextMock } from "resources-management/mocks/context/resource-management-context.mock";
import i18n from "resources-management/statics/locales/i18n";
import MainComponent from "./MainComponent";

describe("Given a MainComponent component", () => {
  beforeAll(async () => {
    await waitFor(() => {
      i18n.init();
      render(
        <ResourcesManagementContext.Provider
          value={resourceManagementContextMock}
        >
          <Provider store={store}>
            <MainComponent />
          </Provider>
        </ResourcesManagementContext.Provider>
      );
    });
  });

  describe("When is rendered and interactions are made", () => {
    test("Then it should render 'Añadir material especial no tipificado' title after click on the preloadedResources tab", () => {
      const preloadedResourcesTab = screen.getAllByRole("tab")[0];
      fireEvent.click(preloadedResourcesTab);
      const addMaterialText = screen.findAllByText(
        "Añadir material especial no tipificado"
      );

      expect(addMaterialText).toBeInTheDocument;
    });
  });
});
