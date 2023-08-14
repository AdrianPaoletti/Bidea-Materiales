import {
  LoadedResourcesTableRow,
  LoadedResourcesTableRowValues,
} from "resources-management/components/LoadedResourcesList/LoadedResourcesTable/loaded-resources-table.model";
import {
  ReportsTableRow,
  ReportsTableRowValues,
} from "resources-management/components/Reports/ReportsTable/reports-table.model";
import {
  ChargeToPatientTableRow,
  ChargeToPatientTableRowValues,
} from "resources-management/components/shared/ChargeToPatient/ChargeToPatientTable/charge-to-patient-table.model";
import {
  PreLoadedResourcesTableRow,
  PreLoadedResourcesTableRowValues,
} from "../../components/PreloadedResources/PreloadedResourcesTable/preloaded-resources-table.model";

export type Content =
  | LoadedResourcesTableRowValues
  | PreLoadedResourcesTableRowValues
  | ChargeToPatientTableRowValues
  | ReportsTableRowValues;

export interface ContentCell {
  id:
    | keyof LoadedResourcesTableRow
    | keyof ReportsTableRow
    | keyof PreLoadedResourcesTableRow
    | keyof ChargeToPatientTableRow;
  content: Content | Content[];
  showCheckBox?: boolean;
  boxChecked?: boolean;
  hasMenuOptions?: boolean;
  rowId?: string | null;
  isBooked?: boolean;
  isAvailable?: boolean;
  incidence?: string;
}
