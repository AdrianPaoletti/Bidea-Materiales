import { QueryBookingTrackingsRequestFilters } from "@ikusi/resources-management-api-typescript-fetch";

import { ReportsTableRow } from "resources-management/components/Reports/ReportsTable/reports-table.model";
import { ReportQueryFilters } from "resources-management/core/models/report-query-filters.model";
import { formatToStringDDMMYYY } from "../../../utils/date-utils/format-date.utils";
import { forwardMesaDeProgramacionApi } from "../forward-api-typescript-fetch/forward-api.service";
import { followedMaterialsApi } from "../resources-management-api-typescript-fetch/resources-management-api.service";

export const getMainTableRows = async (filters: ReportQueryFilters) => {
  const filteredRows = await followedMaterialsApi.queryBookingTrackings({
    queryBookingTrackingsRequest: {
      filters: buildQuery(filters),
    },
  });
  let groupingMap: Map<string, ReportsTableRow> = new Map();

  for (const row of filteredRows) {
    const key = buildMapKey(row.hub, row.interventionRequestCode);
    const node = groupingMap.get(key);
    if (node) {
      node.price += row.barcodeReading?.price || 0;
      groupingMap.set(key, node);
    } else {
      const additionalInfo = (
        await forwardMesaDeProgramacionApi.queryElementoProgramado({
          centro: row.hub,
          codSolicitud: row.interventionRequestCode.toString(),
          fecha: formatToStringDDMMYYY(new Date(row.bookedFrom)),
        })
      ).pop();
      const node: ReportsTableRow = {
        price: row.barcodeReading?.price || 0,
        hub: row.hub,
        interventionDate: row.bookedFrom,
        interventionRequestCode: row.interventionRequestCode,
        NHC: additionalInfo?.cic || "",
        patientCompleteName: additionalInfo?.paciente || "",
        actionButtons: "",
      };
      groupingMap.set(key, node);
    }
  }

  const ret: ReportsTableRow[] = [];
  groupingMap.forEach((value) => ret.push(value));

  return ret;
};

const buildQuery = (
  filters: ReportQueryFilters
): QueryBookingTrackingsRequestFilters => {
  const query: QueryBookingTrackingsRequestFilters = {
    hubInternalCode: filters.hub,
  };
  if (filters.categoryIds?.length) {
    query.categoryIds = filters.categoryIds.map(({ id }) => id);
  }
  if (filters.operatingRoomExternalCodes) {
    query.operatingRoomExternalCodes = filters.operatingRoomExternalCodes.map(
      ({ id }) => id
    );
  }
  if (filters.dateFrom) {
    query.dateFrom = filters.dateFrom;
  }
  if (filters.dateTo) {
    query.dateTo = filters.dateTo;
  }
  if (filters.interventionRequestCode) {
    query.interventionRequestCode = filters.interventionRequestCode;
  }
  return query;
};

const buildMapKey = (hub: string, interventionRequestCode: number) =>
  `${hub}${interventionRequestCode}`;
