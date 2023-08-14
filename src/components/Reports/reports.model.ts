import { ResourceCategoryDTO } from "@ikusi/resources-management-api-typescript-fetch";

import { OperatingRoomCategoriesId } from "resources-management/core/models/report-query-filters.model";
import { ChangeEventDatePicker } from "../shared/FiltersHeader/ScanMaterials/scan-materials.model";

export interface SelectedOperatingRoomsAndCategories {
  operatingRoomExternalCodes: string[];
  categoryIds: string[];
}

export interface SelectedDates {
  dateFrom: null | ChangeEventDatePicker;
  dateTo: null | ChangeEventDatePicker;
}

export interface DatePickerData {
  id: string;
  label: string;
  minDate?: ChangeEventDatePicker | null;
}

export interface DropDownInputs {
  id: keyof SelectedOperatingRoomsAndCategories;
  label: string;
  menuItems: OperatingRoomCategoriesId[] | ResourceCategoryDTO[];
  className: string;
}
