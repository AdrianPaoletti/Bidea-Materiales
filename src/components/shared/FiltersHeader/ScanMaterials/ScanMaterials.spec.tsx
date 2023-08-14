import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { barCodeReadingApi } from "resources-management/core/services/resources-management-api-typescript-fetch/resources-management-api.service";
import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import store from "resources-management/core/store/redux";
import { resourceManagementContextMock } from "resources-management/mocks/context/resource-management-context.mock";
import { mockBarcodeReadingDTO } from "resources-management/mocks/services/object-models.mock";
import i18n from "resources-management/statics/locales/i18n";
import * as utils from "resources-management/utils/barcode-parsing/barcode-device-input-parser.utils";
import ScanMaterial, { ScanMaterialProps } from "./ScanMaterials";

const scanMaterialProps: ScanMaterialProps = {
  setIsOpen: jest.fn(),
  onBarcodeReaded: jest.fn(),
};
const addOrUpdateBarCodeReadingSpy = jest.spyOn(
  barCodeReadingApi,
  "addOrUpdateBarCodeReading"
);
const barcodeDeviceKeyDownEventHandlerSpy = jest.spyOn(
  utils,
  "barcodeDeviceKeyDownEventHandler"
);

describe("Given a ScanMaterial component", () => {
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
          <ScanMaterial {...scanMaterialProps} />
        </Provider>
      </ResourcesManagementContext.Provider>
    );
  });

  describe("When is rendered", () => {
    test("Then it should render a heading with the text 'Escanear material' in it", () => {
      const scanMaterialHeading = screen.getByRole("heading");

      expect(scanMaterialHeading.innerHTML).toBe("Escanear material");
    });
  });

  describe("When is rendered and interactions are made", () => {
    test("Then it should call 'addOrUpdateBarCodeReading' and 'onBarcodeReaded' after fyring the click event from the submit button", async () => {
      const barcodeInput = screen.getAllByRole("textbox")[0];
      fireEvent.change(barcodeInput, { target: { value: "123456" } });

      const submitButton = screen.getAllByRole("button")[3];
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(addOrUpdateBarCodeReadingSpy).toHaveBeenCalledWith({
          newBarcodeDTO: { barcode: "123456" },
        });
        expect(scanMaterialProps.onBarcodeReaded).toHaveBeenCalledWith(
          mockBarcodeReadingDTO
        );
      });
    });

    test("Then it should render clearIcon after fyring the change event from the expireDateInput", () => {
      const expireDateInput = screen.getAllByRole("textbox")[1];

      userEvent.type(expireDateInput, "05/01/2021", { delay: 1 });
      fireEvent.change(expireDateInput, { target: { value: "05/01/2021" } });

      const clearIcon = screen.getByTestId("ClearIcon");

      expect(clearIcon).toBeTruthy();
      fireEvent.click(clearIcon);
      expect(clearIcon).not.toBeInTheDocument;
    });

    test("Then it should call 'barcodeDeviceKeyDownEventHandler' after fyring the keydown event from barcodeInput", () => {
      const barcodeInput = screen.getAllByRole("textbox")[0];
      fireEvent.keyDown(barcodeInput, { key: "5" });
      fireEvent.click(screen.getAllByRole("button")[2]);

      expect(barcodeDeviceKeyDownEventHandlerSpy).toHaveBeenCalled();
    });
  });
});
