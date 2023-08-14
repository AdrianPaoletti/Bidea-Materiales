import { LoadedResourcesTableRow } from "resources-management/components/LoadedResourcesList/LoadedResourcesTable/loaded-resources-table.model";

export const mockLoadedResourcesTableRow: LoadedResourcesTableRow = {
  id: "64929f63d7b96a669ffb848f",
  nameDescription: [
    { id: "name", value: "Material Medtronic 1" },
    { id: "description", value: "Material de prueba" },
  ],
  quantity: 1,
  refference: "999999999999999995",
  serialNumber: "123456",
  expireDate: "2023-06-21T06:57:39.752Z",
  manufacturer: null,
  type: "64929f63d7b96a669ffb843b",
  state: {
    id: "READY",
    i18n: { en: "Ready", es: "Preparado" },
    date: "2023-06-21T06:57:39.763Z",
  },
  incidence: [{ id: "EXPIRED", i18n: { es: "Caducado", en: "Expired" } }],
  actionIconButtons: "",
};
