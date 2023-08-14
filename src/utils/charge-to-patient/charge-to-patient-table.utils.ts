import { FullBookingTrackingDTO } from "@ikusi/resources-management-api-typescript-fetch";

import {
  ChargeToPatientTableRow,
  ToTableType,
} from "../../components/shared/ChargeToPatient/ChargeToPatientTable/charge-to-patient-table.model";

export const formatChargeToPatientTableData = (
  resourcesData: FullBookingTrackingDTO[]
): ChargeToPatientTableRow[] => {
  const rowMap: Map<string, FullBookingTrackingDTO[]> = new Map();
  const unmatchedKey = "unmatched";
  rowMap.set(unmatchedKey, []);

  for (let row of resourcesData) {
    const node = rowMap.get(row.barcodeReading?.refference || "");
    if (row.barcodeReading?.refference && node) {
      node.push(row);
      rowMap.set(row.barcodeReading?.refference, node);
      continue;
    }
    if (row.barcodeReading?.refference) {
      rowMap.set(row.barcodeReading.refference, [row]);
      continue;
    }
    const unmatchedNode = rowMap.get(unmatchedKey);
    unmatchedNode?.push(row);
    rowMap.set(unmatchedKey, unmatchedNode as Array<FullBookingTrackingDTO>);
  }

  const rows: ToTableType[] = [];

  rowMap.forEach((value, key) => {
    const quantity = value.length;
    const item = value[0] as ToTableType;
    if (item) {
      item.quantity = quantity;
      item.children = value;
      rows.push(item);
    }
  });
  return rows.map((row) => ({
    ...formatRowBlock(row),
    openIcon: "",
    quantity: row.quantity,
    children: row.children.map((row) => ({
      ...formatRowBlock(row),
      quantity: 1,
      children: null,
    })),
  }));
};

const formatRowBlock = (row: FullBookingTrackingDTO) => ({
  id: row.id,
  nameDescription: [
    { id: "name", value: row.resource?.name || undefined },
    { id: "description", value: row.resource?.description || undefined },
  ],
  price: row.barcodeReading?.price || null,
  refference: row.barcodeReading?.refference,
  serialNumber:
    row.barcodeReading?.serialNumber || row.barcodeReading?.batchNumber,
  state: row.state,
  incidence: row.incidences,
  actionIconButtons: "",
});
