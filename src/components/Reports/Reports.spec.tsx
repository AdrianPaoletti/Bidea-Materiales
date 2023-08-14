import { Provider } from "react-redux";

import "dayjs/locale/es";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import * as reportsService from "resources-management/core/services/reports/reports.service";
import { followedMaterialsApi } from "resources-management/core/services/resources-management-api-typescript-fetch/resources-management-api.service";
import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import store from "resources-management/core/store/redux";
import { resourceManagementContextMock } from "resources-management/mocks/context/resource-management-context.mock";
import { mockResourcesCategoriesDTO } from "resources-management/mocks/services/object-models.mock";
import i18n from "resources-management/statics/locales/i18n";
import Reports, { ReportsProps } from "./Reports";

const reportsProps: ReportsProps = {
  resourcesCategories: mockResourcesCategoriesDTO,
};

const getPurchaseReportSpy = jest.spyOn(
  followedMaterialsApi,
  "getPurchaseReport"
);
const reportsServiceSpy = jest.spyOn(reportsService, "getMainTableRows");

describe("Given a Returns component", () => {
  beforeAll(async () => {
    await waitFor(() => {
      i18n.init();
    });
  });

  beforeEach(async () => {
    await waitFor(() => {
      render(
        <ResourcesManagementContext.Provider
          value={resourceManagementContextMock}
        >
          <Provider store={store}>
            <Reports {...reportsProps} />
          </Provider>
        </ResourcesManagementContext.Provider>
      );
    });
  });

  describe("When is rendered", () => {
    test("Then it should render 'Todavía no se ha seleccionado periodo de intervenciones'", async () => {
      expect("Todavía no se ha seleccionado periodo de intervenciones")
        .toBeInTheDocument;
    });
  });

  describe("When is rendered and interactions are made", () => {
    test("Then it should call 'reportsService' function after fyring the click event from the consult button", async () => {
      const refferenceCodeInput = screen.getByRole("spinbutton");
      fireEvent.change(refferenceCodeInput, { target: { value: 1234 } });
      const consultButton = screen.getAllByRole("button")[4];
      await waitFor(() => {
        fireEvent.click(consultButton);
      });

      await waitFor(() => {
        expect(reportsServiceSpy).toHaveBeenCalled();
      });
    });

    test("Then it should call 'getPurchaseReport' method after fyring the click event from the generateGlobalReport button", async () => {
      const consultButton = screen.getAllByRole("button")[4];
      await waitFor(() => {
        fireEvent.click(consultButton);
        const generateGlobalReportButton = screen.getByText(
          "Generar informe global"
        );
        fireEvent.click(generateGlobalReportButton);
      });

      expect(getPurchaseReportSpy).toHaveBeenCalled();
    });
  });
});
