import { ReportQueryFilters } from "resources-management/core/models/report-query-filters.model";
import { mockFullBookingTrackingDTO } from "resources-management/mocks/services/object-models.mock";
import { getMainTableRows } from "./reports.service";

describe("Given a getMainTableRows function", () => {
  describe("When is invoked", () => {
    test("Then it should return an array of the expectedObjectResult", async () => {
      const { barcodeReading, bookedFrom, interventionRequestCode, hub } =
        mockFullBookingTrackingDTO;
      const reportQueryFilters: ReportQueryFilters = {
        hub: "1",
        categoryIds: [{ id: "64903432f1860bae2a8e9630", name: "Special" }],
        interventionRequestCode: 1,
        operatingRoomExternalCodes: [{ id: "1000", name: "1000" }],
        dateFrom: "2023-06-18T00:00:00.000Z",
        dateTo: "2023-07-10T00:00:00.000Z",
      };
      const expectedObjectResult = {
        price: barcodeReading?.price,
        hub,
        interventionDate: bookedFrom,
        interventionRequestCode,
        NHC: "",
        patientCompleteName: "",
        actionButtons: "",
      };

      const result = await getMainTableRows(reportQueryFilters);

      expect(result).toEqual([
        {
          ...expectedObjectResult,
          price: (expectedObjectResult.price as number) * 2,
        },
        { ...expectedObjectResult, hub: "2" },
      ]);
    });
  });
});
