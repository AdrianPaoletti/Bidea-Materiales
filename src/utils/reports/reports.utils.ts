import {
  ElementoProgramado,
  QueryElementoProgramadoRequest,
} from "@ikusi/forward-api-typescript-fetch";
import { PurchaseReportRow } from "@ikusi/resources-management-api-typescript-fetch";

export interface QueryElementoProgramadoApi {
  queryElementoProgramado(
    requestParameters: QueryElementoProgramadoRequest
  ): Promise<ElementoProgramado[]>;
}

export const completeReportInfoFromForward = async (
  rows: PurchaseReportRow[],
  api: QueryElementoProgramadoApi
) => {
  const interventionsMap: Map<string, ElementoProgramado> = new Map();
  const newRows: PurchaseReportRow[] = [];

  for (const row of rows) {
    const key = getKey(row.interventionRequestCode.value, row.hub.value);
    let intervention = interventionsMap.get(key);
    if (!intervention) {
      intervention = (
        await api.queryElementoProgramado({
          centro: row.hub.value,
          codSolicitud: `${row.interventionRequestCode.value}`,
          fecha: row.interventionDate.value,
        })
      ).pop();
      if (intervention) {
        interventionsMap.set(key, intervention);
      }
    }
    newRows.push(getNewRow(row, intervention));
  }
  return newRows;
};

const getKey = (code: number, hub: string) => `${code}-${hub}`;
const getNewRow = (
  row: PurchaseReportRow,
  intervention?: ElementoProgramado
): PurchaseReportRow => ({
  ...row,
  nHC: { value: intervention?.cic || "", i18n: { es: "NHC", en: "NHC" } },
  patientCompleteName: {
    value: intervention?.paciente || "",
    i18n: { es: "Paciente", en: "Pacient" },
  },
});
