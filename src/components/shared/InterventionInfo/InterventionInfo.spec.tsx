import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";

import { render, screen } from "@testing-library/react";

import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import store from "resources-management/core/store/redux";
import { resourceManagementContextMock } from "resources-management/mocks/context/resource-management-context.mock";
import { mockInterventionDTO } from "resources-management/mocks/services/object-models.mock";
import i18n from "resources-management/statics/locales/i18n";
import InterventionInfo from "./InterventionInfo";

describe("Given a InterventionInfo component", () => {
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
          <InterventionInfo interventionData={mockInterventionDTO} />
        </Provider>
      </ResourcesManagementContext.Provider>
    );
  });

  describe("When is rendered", () => {
    test("Then it should render the title with the text 'Información intervención' in it", () => {
      const title = screen.getByRole("heading");

      expect(title.innerHTML).toBe("Información intervención");
    });
  });
});
