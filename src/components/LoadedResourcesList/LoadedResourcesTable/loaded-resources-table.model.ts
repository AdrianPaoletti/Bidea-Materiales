import {
  BookingTrackingIncidence,
  BookingTrackingState,
} from "@ikusi/resources-management-api-typescript-fetch";

import { ContentCell } from "resources-management/core/models/content-cell.model";
import { NameDescription } from "resources-management/core/models/description-name.model";
import { IconContentCell } from "resources-management/core/models/icon-content-cell.model";

type NullableRowItem = string | undefined | null;

export interface LoadedResourcesTableRow {
  id: string;
  nameDescription: NameDescription[];
  quantity: number;
  refference: NullableRowItem;
  serialNumber: NullableRowItem;
  expireDate: NullableRowItem;
  manufacturer: NullableRowItem;
  type: NullableRowItem;
  state: BookingTrackingState;
  incidence: Array<BookingTrackingIncidence>;
  actionIconButtons: string;
}

type LoadedResourcesTableRowKeys = keyof LoadedResourcesTableRow;
export type LoadedResourcesTableRowValues =
  LoadedResourcesTableRow[LoadedResourcesTableRowKeys];

export interface LoadedResourcesTableColumn {
  align: "left" | "inherit" | "center" | "right" | "justify";
  id: LoadedResourcesTableRowKeys;
  label: string;
  width: string;
  paddingLeft?: string;
  paddingRight?: string;
  showCheckBox?: boolean;
  menuOptions?: LoadedResourcesRowMenuItems[];
  format?: (
    value: LoadedResourcesTableRowValues
  ) => string | number | React.ReactNode | undefined;
  additionalIconContent?: (
    value: BookingTrackingState[] | BookingTrackingIncidence[]
  ) => IconContentCell[];
  cellContent?: (
    cell: ContentCell,
    additionalIconContent?: IconContentCell[],
    menuItems?: LoadedResourcesRowMenuItems[]
  ) => JSX.Element;
}

export interface LoadedResourcesRowMenuItems {
  label: string;
  action: (rowId: string) => void;
  icon: () => JSX.Element;
}
