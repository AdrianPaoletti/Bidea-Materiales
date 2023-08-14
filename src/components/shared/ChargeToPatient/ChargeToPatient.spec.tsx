import { act } from "react-dom/test-utils";
import { Provider, useDispatch } from "react-redux";

import { FullBookingTrackingDTOBarcodeReading } from "@ikusi/resources-management-api-typescript-fetch";
import { fireEvent, render, screen } from "@testing-library/react";

import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import store from "resources-management/core/store/redux";
import { mockChargeToPatientTableRow } from "resources-management/mocks/components/charge-to-patient-table.mock";
import { resourceManagementContextMock } from "resources-management/mocks/context/resource-management-context.mock";
import { mockFullBookingTrackingDTO } from "resources-management/mocks/services/object-models.mock";
import i18n from "resources-management/statics/locales/i18n";
import * as trackingRequestsService from "../../../core/services/tracking-requests/tracking-requests.service";
import { formatChargeToPatientTableData } from "../../../utils/charge-to-patient/charge-to-patient-table.utils";
import ChargeToPatient, { ChargeToPatientProps } from "./ChargeToPatient";

const chargeToPatientProps: ChargeToPatientProps = {
  isOpen: true,
  setIsOpen: jest.fn(),
  resourcesData: [
    mockFullBookingTrackingDTO,
    { ...mockFullBookingTrackingDTO, id: "2" },
    {
      ...mockFullBookingTrackingDTO,
      id: "3",
      state: {
        id: "PLANNED",
        i18n: {
          en: "Planned",
          es: "Planeado",
        },
        date: "2023-06-19T10:55:46.723Z",
      },
    },
  ],
  onChargedToPatient: jest.fn(),
};

const updateTrackingRequestStateSpy = jest.spyOn(
  trackingRequestsService,
  "updateTrackingRequestState"
);

describe("Given a ChargeToPatient component", () => {
  beforeEach(() => {
    render(
      <ResourcesManagementContext.Provider
        value={resourceManagementContextMock}
      >
        <Provider store={store}>
          <ChargeToPatient {...chargeToPatientProps} />
        </Provider>
      </ResourcesManagementContext.Provider>
    );

    act(() => {
      i18n.init();
    });
  });

  describe("When is rendered", () => {
    test("Then it should render two headings", () => {
      const expectedResult = ["Imputar a paciente", "Información intervención"];
      const headings = screen.getAllByRole("heading");
      const result = headings.map(({ innerHTML }) => innerHTML);

      expect(result).toEqual(expectedResult);
    });
  });

  describe("When is rendered and the chargeToPatientButton is clicked witout any errors", () => {
    test("Then it should call updateTrackingRequestState function", async () => {
      const chargeToPatientButton = screen.getAllByRole("button")[1];
      updateTrackingRequestStateSpy.mockResolvedValue();

      fireEvent.click(chargeToPatientButton);

      expect(updateTrackingRequestStateSpy).toHaveBeenCalledWith(
        mockFullBookingTrackingDTO,
        "CHARGED_TO_PATIENT"
      );
    });

    test("Then rows with state = PLANNED should not be rendered", () => {
      const rowsNumber = screen.getAllByRole("row").length;
      expect(rowsNumber).toEqual(2);
    });
  });

  describe("When is rendered and the chargeToPatientButton is clicked with an error", () => {
    test("Then it should call the useDispatch hook", async () => {
      const chargeToPatientButton = screen.getAllByRole("button")[1];
      updateTrackingRequestStateSpy.mockRejectedValue({});

      fireEvent.click(chargeToPatientButton);

      expect(useDispatch).toHaveBeenCalled();
    });
  });

  describe("When is rendered and the deleteButton is clicked", () => {
    test("Then it should reduce by one the number of rows", async () => {
      const expandButton = screen.getAllByRole("button")[0];
      fireEvent.click(expandButton);
      const prevRowsNumber = screen.getAllByRole("row").length;

      const deleteButton = screen.getAllByRole("button")[1];
      fireEvent.click(deleteButton);
      const rowsNumber = screen.getAllByRole("row").length;

      expect(rowsNumber).toBeLessThan(prevRowsNumber);
      expect(rowsNumber).toEqual(prevRowsNumber - 1);
    });
  });
});

describe("Given a formatChargeToPatientTableData function", () => {
  describe("When is called", () => {
    test("Then it should return a ChargeToPatientTableRow array", () => {
      const expectedResult = [mockChargeToPatientTableRow];

      const result = formatChargeToPatientTableData([
        {
          ...mockFullBookingTrackingDTO,
          id: "3",
          barcodeReading: {
            ...mockFullBookingTrackingDTO.barcodeReading,
            refference: "",
          } as FullBookingTrackingDTOBarcodeReading,
        },
      ]);

      expect(result).toEqual(expectedResult);
    });
  });
});
