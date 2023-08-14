export interface ReportQueryFilters {
  hub: string;
  interventionRequestCode?: number;
  operatingRoomExternalCodes?: OperatingRoomCategoriesId[];
  categoryIds?: OperatingRoomCategoriesId[];
  dateFrom?: string;
  dateTo?: string;
}

export interface OperatingRoomCategoriesId {
  name: string;
  id: string;
}
